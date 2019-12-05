
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

   app.get('/complete', function(req, res){
    res.render('complete', {
      
    });
   });
 app.get('/homepage', isLoggedIn, function(req, res){
  res.render('homepage', {
   user:req.user
  });
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
//reservation.ejs

 app.get('/reservation', isLoggedIn, function(req, res){
  res.render('reservation.ejs', {
   user:req.user
  });
 });
 app.get('/reservation/:id', isLoggedIn, function(req, res){
        res.render('reservation', { ID: req.params.id, Qstr: req.query.qstr });
});

 app.post('/datainsert' ,urlencodedParser, function(req, res) {
      res.redirect('/complete');
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
      var position = req.body.position
		  var sql = "INSERT INTO reservation (roomid,starttime,endtime,opendate,position ) VALUES ('"+room+"','"+start+ "' ,'"+end+ "','"+MeetingDate+ "','"+position+ "')";
      console.log(sql);
		  con.query(sql, function (err, result) {
			  	console.log(result);

          
          
        

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