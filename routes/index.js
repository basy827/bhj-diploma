const router = require('express').Router();
const user = require('./user');
const account = require('./account');
const transaction = require('./transaction');

router.setDb = function(db) {
  user.setDb(db);
  account.setDb(db);
  transaction.setDb(db);
};

router.use('/user', user);
router.use('/account', account);
router.use('/transaction', transaction);

module.exports = router;
