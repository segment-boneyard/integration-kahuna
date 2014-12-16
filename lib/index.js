
/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');

/**
 * Expose `Kahuna`
 *
 * https://app.usekahuna.com/tap/getstarted/server/
 */

var Kahuna = module.exports = integration('Kahuna')
  .channels(['server', 'mobile'])
  .endpoint('https://tap-nexus.appspot.com/log')
  .ensure('settings.key')
  .ensure('settings.env')
  .mapper(mapper)
  .retries(2);

/**
 * Identify.
 *
 * https://app.usekahuna.com/tap/getstarted/server/
 *
 * @param {Object} payload
 * @param {Function} fn
 * @api public
 */

Kahuna.prototype.identify = function(payload, fn){

  var key = this.settings.key;
  // either 's' or 'p' depending on sandbox or prod
  var env = this.settings.env;

  payload.key = key;
  payload.env = env ? 'p' : 's';

  return this
    .post()
    .type('form')
    .send(payload)
    .end(this.handle(fn));
};

/**
 * Track.
 *
 * https://app.usekahuna.com/tap/getstarted/server/
 *
 * @param {Object} payload
 * @param {Function} fn
 * @api public
 */

/*Kahuna.prototype.track = function(payload, fn){
  return this
    .post()
    .send(payload)
    .end(this.handle(fn));
};*/
