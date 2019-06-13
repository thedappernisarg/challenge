'use strict';

import log from '../utils/logger';
import db from '../utils/database';
import Measurement from '../models/measurement';
import { checkTimestamp, filterKeys } from '../utils/helpers';

/**
 * POST measurements
 */
const measurementsPost = (req, res) => {
  log.info('Accessed POST /measurements');

  try {
    const metrics = new Measurement(req.body);
    log.info('metric created in POST');

    db.insert(metrics, (err, newDoc) => {
      if (err) {
        log.error(err);
         return res.status(400).send({ status: 'error', message: err });
      }

    log.info('Row inserted');
    return res
      .status(201)
      .location(`/measurements/${metrics.timestamp}`)
      .send({
        status: 'success',
        message: newDoc
      });
    });
  } catch (e) {
    log.info(e.message);
    res.status(400).send({
      status: 'error',
      message: e.message
    });
  }
};

/**
 * GET request for measurements
 */
const measurementsGet = (req, res) => {
  log.info('Accessed GET /measurements');
  log.info(req.params.timestamp, 'timestamp');

  /**
   * If UTC timestamp, Get a specific measurement
   * Else return array of measurements from a day
   */
  if (checkTimestamp(req.params.timestamp)) {
    log.info('utc');
    db.findOne({ timestamp: req.params.timestamp }, (err, doc) => {
      if (err || !doc) {
       return res.status(404).send({ status: 'err', message: err || 'Query is null' });
     }
      const filteredObj = filterKeys(doc, null, ['_id']);

      log.info(filteredObj);
      return res.status(200).send(filteredObj);
    });
  } else {
    db
      .find({ timestamp: new RegExp(req.params.timestamp) })
      .sort({ timestamp: 1 })
      .exec((err, docs) => {
        log.info(docs);
        if (err) {
          log.error(err);
          return res.status(404).send({ status: 'err', message: err });
        }
        if (!docs.length) {
          return res.status(404).send({ status: 'err', message: 'Query is null' });
        }
          const filteredArr = docs.map(item => filterKeys(item, null, ['_id']));
          log.info(filteredArr);
          return res.status(200).send(filteredArr);
      });
  }
};

/**
 * PUT request for measurements
 */
const measurementsPut = (req, res) => {
 log.info('Accessed PUT /measurements');

 try {
   const metrics = new Measurement(req.body);
   log.info('metric created in PUT');

   db.findOne({ timestamp: req.params.timestamp }, (err, doc) => {
     log.info(doc);

     if (err || !doc) {
       return res.status(404).send({ status: 'err', message: err || 'Query is null' });
     }

     if (metrics.timestamp !== doc.timestamp) {
       return res.status(409).send(doc);
     }

     db.update(
       { timestamp: req.params.timestamp },
       metrics,
       { returnUpdatedDocs: true },
       (err, numAffected, affectedDocuments, upsert) => {
         if (err) {
           log.error(err);
           return res.status(400).send({ status: 'error', message: err });
         }

         log.info('Row inserted');
         return res.status(204).send({
           status: 'success',
           message: affectedDocuments
         });
       }
     );
   });
 } catch (e) {
   log.info(e.message);
   res.status(400).send({
     status: 'error',
     message: e.message
   });
 }
};

/**
 * PATCH request for measurements
 */
const measurementsPatch = (req, res) => {
  log.info('Accessed PATCH /measurements');

  try {
    const metrics = new Measurement(req.body);
    log.info('metric created in POST');

    db.findOne({ timestamp: req.params.timestamp }, (err, doc) => {
      if (err || !doc) {
        return res
          .status(404)
          .send({ status: 'err', message: err || 'Query is null' });
      }

      if (metrics.timestamp !== doc.timestamp) return res.status(409).send(doc);

      db.update(
        { timestamp: req.params.timestamp },
        { $set: metrics },
        { returnUpdatedDocs: true },
        (err, numAffected, affectedDocuments) => {
          if (err) {
            log.error(err);
            return res.status(400).send({ status: 'error', message: err });
          }

          log.info('Row inserted');
          res.status(204).send({
            status: 'success',
            message: affectedDocuments
          });
        }
      );
    });
  } catch (e) {
    log.info(e.message);
    res.status(400).send({
      status: 'error',
      message: e.message
    });
  }
};

/**
 * DELETE request for measurements
 */
const measurementsDelete = (req, res) => {
  log.info('Accessed DELETE /measurements');
  db.remove({ timestamp: req.params.timestamp }, {}, (err, numRemoved) => {
    if (err) {
      return res.status(404).send({ status: 'err', message: err });
    }

    if (numRemoved === 0) {
      return res
        .status(404)
        .send({ status: 'error', message: 'Measurement does not exist' });
    }

    return res.status(204).send({ status: 'success', message: 'deleted' });
  });
};

exports.measurementsPost = measurementsPost;
exports.measurementsGet = measurementsGet;
exports.measurementsPut = measurementsPut;
exports.measurementsPatch = measurementsPatch;
exports.measurementsDelete = measurementsDelete;
