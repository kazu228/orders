var express = require('express');
var router = express.Router();

var mysql = require('mysql');

//mysql of config
var mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: 'Robotics',
    database: 'my-nodeapp-db'
};

// get access of prosec]s\\
router.get('/', (req, res, next) => {
    // ready connection
    var connection = mysql.createConnection(mysql_setting);
    // connect base
    connection.connect();

    // read data
    connection.query('SELECT * from mydata', function (error, results, fields) {
        if (error == null) {
            var data = {
                title: 'mysql',
                content: results
            };
            res.render('hello', data);
        }
    });

    connection.end();
});

module.exports = router;