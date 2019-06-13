'use strict';

// import log from '../utils/logger';
import express from 'express';

import measurementsController from '../controllers/measurementsController';

const router = new express.Router();

// features/01-measurements/01-add-measurement.feature
router.post('/', measurementsController.measurementsPost);

// features/01-measurements/02-get-measurement.feature
router.get('/:timestamp', measurementsController.measurementsGet);

// features/01-measurements/03-update-measurement.feature
router.put('/:timestamp', measurementsController.measurementsPut);

// features/01-measurements/03-update-measurement.feature
router.patch('/:timestamp', measurementsController.measurementsPatch);

// features/01-measurements/04-delete-measurement.feature
router.delete('/:timestamp', measurementsController.measurementsDelete);

module.exports = router;
