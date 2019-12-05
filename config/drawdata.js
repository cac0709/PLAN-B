var mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodejs_login'
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected by drawdata!');
  });
  
 //
  module.exports = function(drawdata) {
    drawdata.serializeData(function(database, done){
     done(null, database.id);
    });
   
    drawdata.deserializeData(function(id, done){
     connection.query("SELECT * FROM reservation where id = ?",[id],
      function(err, rows){
       done(err, rows[0]);
      });
    });
   
    drawdata.use(
     'drawdata',
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
   