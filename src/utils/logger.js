'use strict';

import { logging } from '../config';
import winston from 'winston';
import moment from 'moment';

/**
 * Winston Logger with my defaults
 */
module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp () {
        return moment().format('MM-DD-YYYY HH:mm:ss');
      },
      level: logging.level,
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: true
    })
  ],
  exitOnError: false
});
