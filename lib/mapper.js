/**
 * Module dependencies.
 */

var reject = require('reject');

/**
 * Map identify.
 *
 * @param {Identify} identify
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  var payload = {};
  payload.username = identify.username() || identify.userId();
  payload.user_email = identify.email();
  payload.event = 'start';

  payload.dev_id = identify.proxy('context.device.id');
  payload.dev_name = identify.proxy('context.device.model');
  payload.app_name = identify.proxy('context.app.name');
  payload.app_ver = identify.proxy('context.app.version');
  payload.os_name = identify.proxy('context.os.name');
  payload.os_version = identify.proxy('context.os.version');

  payload.user_info = JSON.stringify(identify.traits());

  return reject(payload);
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
  var payload = {};

  payload.event = track.event();
  payload.username = track.username();
  payload.user_email = track.email();

  var traits = track.proxy('context.traits');

  if (traits) {
    delete traits.id;
    payload.user_info = JSON.stringify(traits);
  }

  payload.dev_id = track.proxy('context.device.id');
  payload.dev_name = track.proxy('context.device.model');
  payload.app_name = track.proxy('context.app.name');
  payload.app_ver = track.proxy('context.app.version');
  payload.os_name = track.proxy('context.os.name');
  payload.os_version = track.proxy('context.os.version');

  return reject(payload);
};
