var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport')(passport);
var logger = require('morgan');




const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
});
let sql = "delete from reservation where opendate  < sysdate()";
connection.query(sql, (err, data) => {
    if (err) {
        throw err;
    }

    // 執行成功
    console.log('delete success!');
    console.log(data);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/kendo')));
app.use(express.static(path.join(__dirname, '/public/stylesheets')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

app.set('view engine', 'ejs');


app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function(req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function(err) {
        if (err) res.send(404);});
    });

    





    
require('./app/routes.js')(app, passport);

app.listen(port);
console.log("已啟動在http://localhost:8080/");