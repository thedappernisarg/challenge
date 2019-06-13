import path from 'path';
import express from 'express';
import { json as parseJsonBody } from 'body-parser';
import requireAll from 'require-all';

const routes = requireAll(path.join(__dirname, 'routes'));

const server = express();

/*
  TODO: Implement the endpoints in the ATs.
  The below stubs are provided as a starting point.
  You may refactor them however you like, so long as the default export of
  this file is the root request handler (i.e. `express()`).
*/

/**
 * Disable x-power-by
 * requests and responses are in JSON
 */
server.disable('x-powered-by');
server.use(parseJsonBody());

/**
 * Server routes
 */

/**
 * Home - /
 */
server.use('/', routes.home);

/**
 * Measurements - /measurements
 */
server.use('/measurements', routes.measurements);

/**
 * Stats - /stats
 */
server.use('/stats', routes.stats);

export default server;
