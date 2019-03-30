var express = require('express');
var router = express.Router();

var mysql = require('mysql');

//mysql of config
var mysql_setting = {
    host: '192.168.0.220',
    user: 'root',
    password: 'kikaku',
    database: 'my-nodeapp-db'
};

// get access of process\\
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
            res.render('mytable/index', data);
        }
    });

    connection.end();
});

// get access of add
router.get('/add', (req, res, next) => {
    var data = {
        title: 'Mytable/Add',
        content: '新しいレコードを入力：'
    }
    res.render('mytable/add', data);
});

// post of add
router.post('/add', (req, res, next) => {
    var nm = req.body.name;
    var ml = req.body.mail;
    var ag = req.body.age;
    var data = {
        'name': nm,
        'mail': ml,
        'age': ag
    };
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('insert into mydata set ?', data, (error, results, fields) => {
        res.redirect('/mytable');
    });
    connection.end();
});

// get of add
router.get('/show', (req, res, next) => {
    var id = req.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * from mydata where id =?', id, (error, results, fields) => {
        if (error == null) {
            var data = {
                title: 'Hello/Show',
                content: 'id = ' + id + 'のレコード：',
                mydata: results[0]
            };
            res.render('mytable/show', data);
        }
    });
    connection.end();
});

module.exports = router;