'use strict';

import express from 'express';

import statsController from '../controllers/statsController';

const router = new express.Router();

router.get('/', statsController.statsGet);

module.exports = router;
