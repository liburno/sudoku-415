const path = require('path')
const fs=require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app=express();
const server = require('http').Server(app);
const port=process.env.PORT || 3001;


app.use('/',express.static('./public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","Content-Length");
    next();
});
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));




app.use((req,res,next)=>{
    req._time=Date.now(); // set time for everyone
    next();
})

app.use('/post', require('./post.js'));  

server.listen(port,() =>{
    console.log('Start server at:',port);
});


