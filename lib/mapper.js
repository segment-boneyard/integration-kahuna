/**
 * Module dependencies.
 */

var reject = require('reject');
var hash = require('string-hash');
var unixTime = require('unix-time');
var foldl = require('@ndhoule/foldl');
var trample = require('@segment/trample');
var is = require('is');

/**
 * Map identify.
 *
 * https://app.usekahuna.com/tap/public_docs/Content/APIs/Server.htm#UserCredentialParameters
 *
 * @param {Identify} identify
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  var traits = identify.traits();
  var payload = {
    event: 'user_created_or_updated_segment', // Asked by Kahuna
    user_info: JSON.stringify(traits),
  };
  payload.credentials = formulateCreds(identify);

  return addDeviceParams(identify, payload);
};

/**
 * Map track
 *
 * https://app.usekahuna.com/tap/public_docs/Content/APIs/Server.htm#Intelligent_Event_Request
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  var payload = {};
  // Some track events that are campaign critical inside Kahuna may depend on user attributes
  var traits = track.proxy('context.traits');
  if (traits && !isEmpty(traits)) {
    traits.id = track.userId(); // adding traits.id for parity with identify.traits()
    payload.user_info = JSON.stringify(traits);
  }
  var events = [{
    event: track.event(),
    time: unixTime(track.timestamp())
  }];

  // Formulate properties to required specs
  var flattenedObj = trample(reject(track.properties()));
  events[0].properties = foldl(function(results, value, key){
    if (value) {
      if (!is.array(value)) value = [value];
      results[key] = reject(value.map(function(prop){
        if (prop) return prop.toString();
      }));
    }
    return results;
  }, {}, flattenedObj);

  payload.events = JSON.stringify(events);
  payload.credentials = formulateCreds(track);

  return addDeviceParams(track, payload);
};

/**
 * Augments the `payload` with common fields, returns a cleaned-up object.
 *
 * https://app.usekahuna.com/tap/public_docs/Content/APIs/Server.htm#DeviceParameters
 *
 * @param {Facade} facade
 * @param {Object} payload
 * @return {Object}
 * @api private
 */

function addDeviceParams(facade, payload) {
  // device props
  payload.dev_id = getOrGenerateDevId(facade, payload);
  payload.dev_name = facade.proxy('context.device.model');

  // app props
  payload.app_name = facade.proxy('context.app.name');
  payload.app_ver = facade.proxy('context.app.version');

  // os props
  if (facade.proxy('context.os.name')) payload.os_name = facade.proxy('context.os.name').toLowerCase();

  // Preserve `ios` or `android` if that's what the client sent.
  if (payload.os_name !== 'ios' && payload.os_name !== 'android') {
    // Try to coerce it to the appropriate platform.
    // Can let android just pass through since it is same string
    if (payload.os_name === 'iphone os') {
      payload.os_name = 'ios';
    } else {
      // don't send anything if it's not `Android` or `iPhone OS`.
      // Kahuna will record it as a `web` user on their end.
      delete payload.os_name;
    }
  }
  payload.os_version = facade.proxy('context.os.version');

  // reject empty properties
  return reject(payload);
}

/**
 * Formulate credential payload
 *
 * @param {Object} facade
 * @return {Object}
 * @api private
 */

function formulateCreds(facade){
  var credentials = {
    user_id: facade.userId(),
    email: facade.email()
  }

  return JSON.stringify(reject(credentials));
}

/**
 * Get the DeviceId or Generate one
 *
 * Necessary incase they are only sending `user_id` and no email
 *
 * @param {Object} facade
 * @param {Object} payload
 *
 * @return {String}
 * @api private
 */

function getOrGenerateDevId(facade, payload) {
  var devId = facade.proxy('context.device.id');
  if (devId && devId.length > 0) {
    return devId;
  }
  if (facade.userId()) {
    devId = "nodev-segment-user-id-" + hash(facade.userId());
  } else if (facade.username()) {
    devId = "nodev-segment-" + hash(facade.username());
  } else if (facade.email()) {
    devId = "nodev-segment-" + hash(facade.email());
  }

  return devId;
}

/**
 * Check if object is empty
 *
 * @param {Object} obj
 *
 * @return {Boolean}
 * @api private
 */

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
