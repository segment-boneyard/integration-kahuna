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
  payload.username = identify.userId() || identify.username();
  payload.user_email = identify.email();
  payload.event = 'start';

  var context = identify.context();

  payload.dev_id = identify.proxy('context.device.id');
  payload.dev_name = identify.proxy('context.device.model');
  payload.app_name = identify.proxy('context.app.name');
  payload.app_ver = identify.proxy('context.app.version');
  payload.os_name = identify.proxy('context.os.name');
  payload.os_version = identify.proxy('context.os.version');

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

/*exports.track = function(track){
  return track.json();
};*/
