var express = require('express');
var uid = require('uid-safe');

const router = express.Router();

/* GET a guid. */
router.get('/', (req, res, next) => {
    const strUid = uid.sync(18);
    res.json({guid: strUid});
});

module.exports = router;
