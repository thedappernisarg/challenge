'use strict';

import log from '../utils/logger';
import express from 'express';

const router = new express.Router();

router.get('/', (req, res) => {
  log.info('Accessed /');
  res.status(200).send('Weather tracker is up and running!\n');
});

module.exports = router;
