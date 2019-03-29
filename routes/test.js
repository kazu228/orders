var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    var data = {
        tit: 'TEST!',
        con: 'これは、TESTです。<br>this is test.'
    };
    res.render('test', data);
});

module.exports = router;