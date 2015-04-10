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
  var payload = {
    event: 'start',
    username: identify.username() || identify.userId(),
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
    username: track.username()
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
  payload.dev_id = facade.proxy('context.device.id');
  payload.dev_name = facade.proxy('context.device.model');

  // app props
  payload.app_name = facade.proxy('context.app.name');
  payload.app_ver = facade.proxy('context.app.version');

  // os props
  payload.os_name = facade.proxy('context.os.name');
  payload.os_version = facade.proxy('context.os.version');

  // reject empty properties
  return reject(payload);
}
