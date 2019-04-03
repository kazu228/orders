var express = require('express');
var router = express.Router();

var mysql = require('mysql');

//knex
var knex = require('knex')({
    dialect: 'mysql',
    connection: {
        host: '192.168.0.220',
        user: 'root',
        password: 'kikaku',
        database: 'my-nodeapp-db',
        charset: 'utf8'
    }
});

var Bookshelf = require('bookshelf')(knex);
var MyData = Bookshelf.Model.extend({
    tableName: 'mydata'
});

//mysql of config
var mysql_setting = {
    host: '192.168.0.220',
    user: 'root',
    password: 'kikaku',
    database: 'my-nodeapp-db'
};

// get access of process\\
router.get('/', (req, res, next) => {
    new MyData().fetchAll().then((collection) => {
        var data = {
            title: 'Hello!',
            content: collection.toArray()
        };
        res.render('knextable/index', data);
    }).catch((err) => {
        res.status(500).json({
            error: true,
            data: {
                message: err.message
            }
        });
    });
});

// get access of add
router.get('/add', (req, res, next) => {
    var data = {
        title: 'knextable/Add',
        content: '新しいレコードを入力：'
    };
    res.render('knextable/add', data);
});

// post of add
router.post('/add', (req, res, next) => {
    var response = res;
    new MyData(req.body).save().then((model) => {
        response.redirect('/knextable');
    });
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

router.get('/find', (req, res, next) => {
    var data = {
        title: '/knex/find',
        content: '検索IDを入力：',
        form: {
            fstr: ''
        },
        mydata: null
    };
    res.render('knextable/find', data);
});

router.post('/find', (req, res, next) => {
    new MyData().where('id', '=', req.body.fstr).fetch().then((collection) => {
        var data = {
            title: 'knextable!',
            content: '※ID = ' + req.body.fstr + 'の検索結果：',
            form: req.body,
            mydata: collection
        };
        res.render('knextable/find', data);
        // res.render('knextable/find');
    });
});


Bookshelf.plugin('pagination');

router.get('/:page', (req, res, next) => {
    var pg = req.params.page;
    pg *= 1;
    if (pg < 1) {
        pg = 1;
    }
    new MyData().fetchPage({
        page: pg,
        pageSize: 3
    }).then((collection) => {
        var data = {
            title: 'Jellop1!',
            content: collection.toArray(),
            pagination: collection.pagination
        };
        // console.log(collection.pagination);
        res.render('knextable/index', data);
    }).catch((err) => {
        res.status(500).json({
            error: true,
            data: {
                message: err.message
            }
        });
    });
});

module.exports = router;