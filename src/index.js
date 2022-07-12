const path = require('path');
const http = require("http");
const express = require('express');
const db = require('./config/database');
const route = require('./router/web');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const upload = require ('express-fileupload') ;
const configTemplate = require('./config/template/config');
db.connect();
var morgan = require('morgan');
const app = express();
app.use(upload());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
const port = 5000
app.use( express.static(path.join(__dirname , 'public')));
configTemplate(app);
route(app);
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// });
const server = http.createServer(app);

//-----------------------------------------------------

server.listen(process.env.PORT || 5000, () => {
  console.log(`server run  running at http://localhost:5000`);
});