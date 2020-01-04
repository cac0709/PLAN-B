
var bodyParser = require('body-parser');
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport  = require('passport');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var upload = require('express-fileupload');
var formidable = require('formidable');
const multer = require('multer')
module.exports = function(app) {
  
  app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function(req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function(err) {
        if (err) res.send(404);});
    })
 
    app.use(bodyParser.json());
 
  app.get('/', function(req, res){
  res.render('login', {message:req.flash('loginMessage')});
 });

 app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/homepage',
  failureRedirect: '/error',
  failureFlash: true
 }),
  function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
  });
  app.get('/error', function(req, res){
    res.render('error', {

    });
   });
   app.get('/errorreservation', function(req, res){
    res.render('errorinreservation', {

    });
   });
   app.get('/erroredit', function(req, res){
    res.render('erroredit', {

    });
   });

   app.get('/complete', function(req, res){
    res.render('complete', {
      
    });
   });
 //homepae.ejs
   app.get('/homepage', isLoggedIn, function(req, res){
        res.render('homepage', {user:req.user});
      })

app.get('/checkin', isLoggedIn, function(req, res){
res.render('checkin', {
   user:req.user
  });
 });

 app.post('/checkin', function(req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
  });
var searchroom = req.body['ROOMID'];
var searchstart = req.body['STARTTIME'];
var searchend = req.body['ENDTIME'];
var searchdate = req.body['OPENDATE'];
var searchdepartment = req.body['DEPARTMENT'];
var searchtopic = req.body['MEETINGNAME'];
var searchmeetingroomcode = req.body['MEETCODE'];
var sqlforsearch = 'select roomid as ROOMID,starttime as STARTTIME,endtime as ENDTIME,opendate as OPENDATE,department as DEPARTMENT,meetingroomcode as MEETCODE,meetingname as MEETINGNAME from reservation where (roomid="'+ searchroom +'" OR starttime="'+ searchstart +'"OR endtime="'+ searchend +'"OR opendate="'+ searchdate +'"OR department="'+ searchdepartment +'"OR meetingname="'+ searchtopic +'"OR meetingroomcode="'+searchmeetingroomcode+'")'
con.query(sqlforsearch, function(err, rows) {
     console.log('搜尋結果',rows);
    if(err){
      console.log(err);
    }else{
      res.json(rows);
    }
  }
  );
});

app.post('/memberlist',function(req,res,next){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
  });
  var sql = "select username as USERNAME,name as NAME,department as MEMBERDEPARTMENT,sign as SIGN from users"

  con.query(sql,function(err,rows){
    console.log(rows);
    if(err){
      console.log(err);
    }else{
      res.json(rows);
      //res.end();
    }
  })
});
app.post('/signfun',function(req,res){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
  });
  var username = req.body['USERNAME'];
  console.log(username);
  var sql = "update users set sign =  'O'  where username = '"+username+"'";

  con.query(sql,function(err,rows){
    console.log(rows);
    if(err){
      console.log(err);
    }else{
      res.send(true);
      //res.end();
    }
  })
});


//edit ejs function
 app.get('/edit', isLoggedIn, function(req, res){
  res.render('edit', {
   user:req.user
  });
 });
 app.get('/errorforupload', isLoggedIn, function(req, res){
  res.render('errorforupload', {
  });
 });
 app.get('/completeforupload', isLoggedIn, function(req, res){
  res.render('completeforupload', {
  
  });
 });
 
 
 
 
 app.post('/update',urlencodedParser, function(req, res) {
  console.log(req.body);
  
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "nodejs_login",
  });
  var updateroom = req.body['UPDATEROOM'];
  var updatestarttime = req.body['UPDATESTARTTIME'];
  var updateendtime = req.body['UPDATEENDTIME'];
  var updateopendate = req.body['UPDATEOPENDATE'];
  var updatedepartment = req.body['UPDATEDEPARTMENT'];
  var updatetopic = req.body['UPDATETOPIC'];
  var updatemeetingcode = req.body['UPDATECODE'];
  var sqlforedit = "update reservation set roomid='" + updateroom + "',starttime='" +updatestarttime + "',endtime='" +updateendtime + "',opendate='" +updateopendate + "',department='" +updatedepartment + "',meetingname='" +updatetopic + "' where meetingroomcode=" + updatemeetingcode;
  con.query(sqlforedit,function(err,rows){
    if(err){
      console.log(err);
    }else{
      res.send(true);
    }
  })

});






  app.use(upload());
  app.post('/upload',function(req,res){
    console.log(req.files);
    if(req.files.upfile){
      var file = req.files.upfile,
        name = file.name,
        type = file.mimetype;
      var uploadpath =  path.resolve(__dirname, '../uploads/' + name);

      file.mv(uploadpath,function(err){
        if(err){
          console.log("File Upload Failed",name,err);
          res.redirect("errorforupload")
        }
        else {
          console.log("File Uploaded",name);
          res.redirect('completeforupload')
    }
  });
}
else{
  res.redirect('errorforupload')
  res.end();
};
})


 app.get('/record', isLoggedIn, function(req, res){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
});
var sqlforrecord = 'select meetingname ,opendate,meetingroomcode from reservation'
con.query(sqlforrecord, function (err, result) {
  console.log(result);
  meetingdata = result;
  if (err) {
            res.redirect('errorr')
          } else {
            res.render('record',{meetingdata:meetingdata,user:req.user})
          }
      });
  
  });


 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 })
//reservation.ejs insert and search

 app.get('/reservation', isLoggedIn, function(req, res){
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
});
var sql = 'select name ,username,department from users'
con.query(sql, function (err, result) {
  console.log(result);
    memberselect = result;
  if (err) {
            res.redirect('errorr')
          } else {
            res.render('reservation',{memberselect:memberselect,user:req.user})
          }
      });
  
  });

    
 app.post('/insert' , function(req, res) {
      var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "123456",
				database: "nodejs_login",
		});
      var start = req.body['STARTTIME'];
      var end = req.body['ENDTIME'];
      var room = req.body['MEETINGROOM'];
      var MeetingDate = req.body['OPENDATE'];
      var department = req.body['DEPARTMENT'];
      var meetingname = req.body['MEETINGNAME'];
      var meetingroomcode = req.body['MEETINGROOMCODE'];
      var note = req.body['NOTE'];
		  var sql = "INSERT INTO reservation (roomid,starttime,endtime,opendate,department,meetingname,meetingroomcode,note ) VALUES ('"+room+"','"+start+ "' ,'"+end+ "','"+MeetingDate+ "','"+department+ "','"+meetingname+ "','"+meetingroomcode+"','"+note+"')";
            con.query(sql,function(err,rows){
              if(err){
                console.log(err);
              }else{
                res.send(true);
              }
            })
      
        });

  


 };
 
	


	

		// console.log(con);
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');

}