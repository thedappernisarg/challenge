'use strict';

import log from '../utils/logger';
import db from '../utils/database';

/**
 * GET request for stats
 */
const statsGet = (req, res) => {
  log.info('Accessed GET /stats');

  db
    .find({
      timestamp: { $gte: req.query.fromDateTime, $lt: req.query.toDateTime }
    })
    .sort({ timestamp: 1 })
    .exec((err, docs) => {
      if (
        err ||
        docs.length < 1 ||
        (typeof req.query.metric !== 'string' &&
          !Array.isArray(req.query.metric))
      ) {
        return res
          .status(404)
          .send({ status: 'err', message: err || 'Query is null' });
      }

      let metric = req.query.metric;
      let stats = null;
      let reqStats = [];

      if (!Array.isArray(metric)) {
        log.info('Single Metric');

        stats = getStats(docs, metric);

        if (stats.length < 1) {
          return res.status(200).send(stats);
        }

        reqStats = createStats(req.query.stat, stats, metric);
      } else {
        log.info('Multi Metric');

        let temp = metric.map(m => {
          stats = getStats(docs, m);
          if (stats.length > 0) {
            return createStats(req.query.stat, stats, m);
          }
        });

        reqStats = [].concat(...temp).filter(i => i !== undefined);
      }

      res.status(200).send(reqStats);
    });
};

const getMin = arr => Math.min(...arr);

const getMax = arr => Math.max(...arr);

const getAvg = arr => round(arr.reduce((a, b) => a + b, 0) / arr.length);

const round = num => Math.round(num * 100) / 100;

const getStats = (arr, metric) =>
  arr.map(item => item[metric]).filter(i => i !== undefined);

const createStats = (arr, stats, metric) =>
  arr.map(stat => {
    if (stat === 'min') {
      return {
        metric,
        stat,
        value: getMin(stats)
      };
    }

    if (stat === 'max') {
      return {
        metric,
        stat,
        value: getMax(stats)
      };
    }

    if (stat === 'average') {
      return {
        metric,
        stat,
        value: getAvg(stats)
      };
    }
  });

exports.statsGet = statsGet;
