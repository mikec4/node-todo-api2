const express=require('express');
const bodParser=require('body-parser');


var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');


var app=express();

app.use(bodParser.json());

app.post('/todoz',function(req,res){
     
    var todo=new Todo(req.body);
    todo.save().then((doc)=>{
        if(doc){
            res.send(doc);
        }
    }).catch((err)=>{
        res.status(404).send(err);
    });
});

app.listen(3000,()=>{
    console.log('Listeng to port',3000);
});

