var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var cleanData = '';
var readData = '';
// Seirlaport
var sp = require('serialport');
var UART1_port = "/dev/ttyO1";
var option = { baudrate : 9600 };
var serialPort = '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var server = app.listen(52273,function(){
  console.log("Server is running at 52273 port");
});

var io = require("socket.io").listen(server);

io.on('connection',function(socket){

  // serialport
  socket.on("serial_connect",function(data){
    switch(data){
      case 'connect' :
        serialPort = new sp.SerialPort(UART1_port, option,true,function(err){
          if(err){
            console.log("connect error");
            socket.emit("serial_connect","error");
            serialPort = '';
          }else{
              console.log("Serial port open");
              io.sockets.emit("serial_connect","success");

              serialPort.on('data',function(data){
              //console.log(data.toString());
              readData += data.toString();
              DataParser();
              });
          }
        });
        break;

      case 'disconnect' :
        console.log("Serialport close");
        serialPort.close();
        serialPort = '';
        io.sockets.emit("serial_connect","disconnect");
        break;

    }
    
  });

  socket.on("send_data",function(data){
    if(serialPort){
      console.log("Sending data : "+data);
      serialPort.write(data);
    }
  });


});


function DataParser(){
  var startString = readData.indexOf('{');
  var endString = readData.indexOf('}',readData.indexOf('{'));
  if (startString >=0 && endString >= 0){
    cleanData = '{'+readData.substring(startString+1,endString)+'}';
    //readData = readData.substring(endString+1,readData.length);
    readData = '';
    //console.log(cleanData);
    io.sockets.emit("received_data",cleanData);
  }
}