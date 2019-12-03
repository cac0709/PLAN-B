var app = express(); 
var login = require('./routes/login');
app.use('/login', login);
app.use('/reg', reg);



