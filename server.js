const path = require('path')
const fs=require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app=express();
const server = require('http').Server(app);
const port=process.env.PORT || 3000;

app.use('/',express.static('./public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","Content-Length");
    next();
});
server.listen(port,() =>{
    console.log('Start server at:',port);
});


