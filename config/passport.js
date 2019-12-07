var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM users WHERE id = ? ", [id],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [username,password],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage'));
    }
    return done(null, rows[0]);
   });
  })
 );
};