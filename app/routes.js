
var bodyParser = require('body-parser');
var mysql = require('mysql');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport  = require('passport');





module.exports = function(app) {
  app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function(req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function(err) {
        if (err) res.send(404);});
    });
 
 
 
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
   app.get('/errorre', function(req, res){
    res.render('errorinreservation', {

    });
   });

   app.get('/complete', function(req, res){
    res.render('complete', {
      
    });
   });
 //homepae.ejs
   app.get('/homepage', isLoggedIn, function(req, res){
        res.render('homepage', {user:req.user});
      });
 app.get('/checkin', isLoggedIn, function(req, res){
  res.render('checkin', {
   user:req.user
  });
 });

 app.get('/edit', isLoggedIn, function(req, res){
  res.render('edit', {
   user:req.user
  });
 });
 app.get('/record', isLoggedIn, function(req, res){
  res.render('record', {
   user:req.user
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
app.post('/search',urlencodedParser, function(req, res) {
console.log(req.body);

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "nodejs_login",
});
var data = {};
var searchroom = req.body.searchroomid
var searchstart = req.body.searchstarttime
var searchend = req.body.searchendtime
var searchdate = req.body.searchopendate
var searchdepartment = req.body.searchdepartment
var searchtopic = req.body.searchtopic
var sqlforsearch = 'select * from reservation where (roomid="'+ searchroom +'" OR starttime="'+ searchstart +'"OR endtime="'+ searchend +'"OR opendate="'+ searchdate +'"OR department="'+ searchdepartment +'"OR meetingname="'+ searchtopic +'")'
 con.query(sqlforsearch, function(err, rows) {
     console.log('搜尋結果',rows);
     data.reservation = rows;
     if (err)  {
            throw err;
            } else {
              res.render('searchpage',{data:data.reservation});
            }
     
    })

app.get('/searchpage', isLoggedIn, function(req, res){
  res.render('searchpage', {
   data:data.reservation,
  });
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
      var start = req.body.StartTime
      var end = req.body.endtime
      var room = req.body.meetingroom
      var MeetingDate = req.body.opendate
      var department = req.body.department
      var meetingname = req.body.meetingname
		  var sql = "INSERT INTO reservation (roomid,starttime,endtime,opendate,department,meetingname ) VALUES ('"+room+"','"+start+ "' ,'"+end+ "','"+MeetingDate+ "','"+department+ "','"+meetingname+ "')";
      console.log(sql);
		  con.query(sql, function (err, result) {
          console.log(result);
 
          if (err) {
                    res.redirect('errorre')
                  } else {
                    res.redirect('complete')
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