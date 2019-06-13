'use strict';

import Datastore from 'nedb';

let db = new Datastore({ inMemoryOnly: true });

export default db;
