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
  var context = identify.context();
  payload.dev_id = context.device.id;
  payload.username = identify.userId() || identify.username();
  payload.user_email = identify.email();
  payload.event = 'start';

  payload.app_name = context.app.name;
  payload.app_ver = context.app.version;
  payload.os_name = context.os.name;
  payload.os_version = context.os.version;
  payload.dev_name = context.device.model;

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
