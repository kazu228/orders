var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    var data = {
        title: 'MyTable!',
        content: 'これは、サンプルのコンテンツです。<br>this is sample contents.'
    };
    res.render('Mytable', data);
});

module.exports = router;