'use strict';

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
  .channels(['server', 'mobile', 'client'])
  .endpoint('https://tap-nexus.appspot.com/log')
  .ensure('settings.apiKey')
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

Kahuna.prototype.identify = function(payload, fn) {
  payload.key = this.settings.apiKey;
  payload.env = this.settings.env ? 'p' : 's'; // 'prod' vs 'sandbox'

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

Kahuna.prototype.track = function(payload, fn) {
  payload.key = this.settings.apiKey;
  payload.env = this.settings.env ? 'p' : 's'; // 'prod' vs 'sandbox'

  return this
    .post()
    .type('form')
    .send(payload)
    .end(this.handle(fn));
};
