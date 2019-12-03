module.exports = function(app, passport) {
 app.get('/', function(req, res){
  res.render('login.ejs', {message:req.flash('loginMessage')});
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
    res.render('error.ejs', {
       user:req.user
    });
   });

 app.get('/homepage', isLoggedIn, function(req, res){
  res.render('homepage.ejs', {
   user:req.user
  });
 });

 app.get('/checkin', isLoggedIn, function(req, res){
  res.render('checkin.ejs', {
   user:req.user
  });
 });

 app.get('/edit', isLoggedIn, function(req, res){
  res.render('edit.ejs', {
   user:req.user
  });
 });

 app.get('/record', isLoggedIn, function(req, res){
  res.render('record.ejs', {
   user:req.user
  });
 });

 app.get('/reservation', isLoggedIn, function(req, res){
  res.render('reservation.ejs', {
   user:req.user
  });
 });

 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 })
};
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
}