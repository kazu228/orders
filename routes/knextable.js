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
            res.render('knextable/index', data);
        }
    });

    connection.end();
});

// get access of add
router.get('/add', (req, res, next) => {
    var data = {
        title: 'knextable/Add',
        content: '新しいレコードを入力：'
    }
    res.render('knextable/add', data);
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
        res.redirect('/knextable');
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
                title: 'knextable/Show',
                content: 'id = ' + id + 'のレコード：',
                mydata: results[0]
            };
            res.render('knextable/show', data);
        }
    });
    connection.end();
});

// get of edit
router.get('/edit', (req, res, next) => {
    var id = req.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * from mydata where id=?', id, (error, results, fields) => {
        if (error == null) {
            var data = {
                title: 'knextable/Edit',
                content: 'id= ' + id + ' のレコード：',
                mydata: results[0]
            };
            res.render('knextable/edit', data);
        }
    });
    connection.end();
});

// get of edit
router.post('/edit', (req, res, next) => {
    var id = req.body.id;
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
    connection.query('update mydata set ? where id = ?',
        [data, id], (error, results, fields) => {
            res.redirect('/knextable');
        });
    connection.end();
});

//get of delete
router.get('/delete', (req, res, next) => {
    var id = req.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * from mydata where id=?', id, (error, results, fields) => {
        if (error == null) {
            var data = {
                title: 'knextable/Delete',
                content: 'id= ' + id + ' のレコード：',
                mydata: results[0]
            };
            res.render('knextable/delete', data);
        }
    });
    connection.end();
});

router.post('/delete', (req, res, next) => {
    var id = req.body.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('delete from mydata where id=?', id, (error, results, fields) => {
        res.redirect('/knextable');
    });
    connection.end();
});

module.exports = router;