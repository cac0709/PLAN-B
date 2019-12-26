
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
  var data = {};
  var updateroom = req.body.updateroom
  var updatestarttime = req.body.updatestarttime
  var updateendtime = req.body.updateendtime
  var updateopendate = req.body.updateopendate
  var updatedepartment = req.body.updatedepartment
  var updatetopic = req.body.updatetopic
  var updatemeetingcode = req.body.updatemeetingcode
  
  var sqlforedit = "update reservation set roomid='" + updateroom + "',starttime='" +updatestarttime + "',endtime='" +updateendtime + "',opendate='" +updateopendate + "',department='" +updatedepartment + "',meetingname='" +updatetopic + "' where meetingroomcode=" + updatemeetingcode;
  con.query(sqlforedit, function(err, rows) {
    console.log(rows);
    data.edit = rows;
    if (err)  {
           res.redirect('erroredit');
           } else {
             res.render('complete');
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
  res.render('reservation.ejs', {
   user:req.user
  });
 });
 
    
 app.post('/datainsert' ,urlencodedParser, function(req, res) {
      console.log(req.body);
      var con = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "123456",
				database: "nodejs_login",
		});
    
		con.connect(function(err) {
		 if (err) throw err;
      console.log("Connected!");
      var dataresualt = {};
      var start = req.body.StartTime
      var end = req.body.endtime
      var room = req.body.meetingroom
      var MeetingDate = req.body.opendate
      var department = req.body.department
      var meetingname = req.body.meetingname
      var meetingroomcode = req.body.meetingroomcode
		  var sql = "INSERT INTO reservation (roomid,starttime,endtime,opendate,department,meetingname,meetingroomcode ) VALUES ('"+room+"','"+start+ "' ,'"+end+ "','"+MeetingDate+ "','"+department+ "','"+meetingname+ "','"+meetingroomcode+"')";
      console.log(sql);
		  con.query(sql, function (err, result) {
          console.log(result);
          dataresualt.reservationinsert = result;
          if (err) {
                    res.redirect('errorreservation')
                  } else {
                    res.render('complete',{data2:dataresualt.reservationinsert})
                  }
              });
        
        
        
        
        
        
        });

      });


 };
 
	


	

		// console.log(con);
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');

}