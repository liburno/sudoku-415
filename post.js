const fs = require('fs');
const router = require('express').Router();
class Response {
    constructor(req,data,err,messages) {
        this.date=new Date();
        if (req) this.time=(Date.now()-req._time);
        this.data=data;
        this.err=err;
        this.messages=messages
    }
}

function getlist() {
    var rr=[];
    var v=fs.readdirSync("./data");
    for (var a of v) {
        if (a.substr(-6)=="schema") {
            rr.push(a.substr(0,a.length-7)); 
        }
    }
    return rr;
}


module.exports = router;
router
    .post('/', (req, res) => {
        res.send(new Response(req, [
            "jGetNota",
            "jCreateNota",
            "jSaveNota",
            "jDeleteNota",
            "jCreateNota",
            "jListNota",
            "jListCats",
            "jListTitles"
        ]))
    })
    .post("/jGetSchema",(req, res) => {
        try {
            var {id} =req.body;
            var file=`./data/${id}.schema`;
            if (fs.existsSync(file)) {
                var r=fs.readFileSync(file,{encoding:'utf8'});
                res.send(new Response(req,r))
            } else {
                throw new Error(`missing schema: ${id}`);
            }
        } catch(e) { res.send(new Response(req,undefined,e.message)); }
    })
    .post("/jSaveSchema",(req, res) => {
        try {
            var {id,data} =req.body;
            if (!id || !data) throw new Error(`Missing Data: ${id}`)
            var file=`./data/${id}.schema`;
            
            fs.writeFileSync(file,data,{encoding:'utf8'});
            res.send(new Response(req,getlist()))
        } catch(e) { res.send(new Response(req,undefined,e.message)); }
    })
    .post("/jDeleteSchema",(req, res) => {
        try {
            var {id} =req.body;
            var file=`./data/${id}.schema`;
            if (fs.existsSync(file)) {
                var r=fs.unlinkSync(file);
                res.send(new Response(req,getlist()))
            } else {
                throw new Error(`missing schema: ${id}`);
            }
        } catch(e) { res.send(new Response(req,undefined,e.message)); }
    })
    .post("/jListSchema",(req, res) => {
        try {
            res.send(new Response(req,getlist()));
        } catch(e) { res.send(new Response(req,undefined,e.message)); }
    })
    