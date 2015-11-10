/**
 * Module dependencies.
 */

var reject = require('reject');
var hash = require('string-hash');

/**
 * Map identify.
 *
 * @param {Identify} identify
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  var payload = {
    event: 'start',
    user_id: identify.userId(),
    user_info: JSON.stringify(identify.traits())
  };

  return decorate(identify, payload);
};

/**
 * Map track
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  var payload = {
    event: track.event(),
    user_id: track.userId()
  };

  var traits = track.proxy('context.traits');

  // if user did not provide traits manually on client, this may be _undesired_,
  // but we have no way to really enforce this since the server doesn't
  // technically require these fields
  if (traits) {
    delete traits.id;
    payload.user_info = JSON.stringify(traits);
  }

  return decorate(track, payload);
};

/**
 * Augments the `payload` with common fields, returns a cleaned-up object.
 *
 * @param {Facade} facade
 * @param {Object} payload
 * @return {Object}
 * @api private
 */

function decorate(facade, payload) {
  // user props
  payload.user_email = facade.email();

  // device props
  payload.dev_id = getOrGenerateDevId(facade, payload);
  payload.dev_name = facade.proxy('context.device.model');

  // app props
  payload.app_name = facade.proxy('context.app.name');
  payload.app_ver = facade.proxy('context.app.version');

  // os props
  payload.os_name = facade.proxy('context.os.name');
  // Preserve `ios` or `android` if that's what the client sent.
  // Note: comparisons are case sensitive, so `iOS` would actually be rejected.
  if (payload.os_name !== 'ios' && payload.os_name !== 'android') {
    // Try to coerce it to the appropriate platform.
    if (payload.os_name === 'iPhone OS') {
      payload.os_name = 'ios';
    } else if (payload.os_name === 'Android') {
      payload.os_name = 'android';
    } else {
      // don't send anything if it's not `Android` or `iPhone OS`.
      // Kahuna will record it as a `web` user on their end.
      delete payload.os_name;
    }
  };
  payload.os_version = facade.proxy('context.os.version');

  // reject empty properties
  return reject(payload);
}

function getOrGenerateDevId(facade, payload) {
    var devId = facade.proxy('context.device.id');
    if (devId && devId.length > 0) {
        return devId;
    }
    if (payload.user_id) {
        devId = "nodev-segment-" + hash(payload.user_id);
    } else if (payload.user_email) {
        devId = "nodev-segment-" + hash(payload.user_email);
    }
    return devId;
}
