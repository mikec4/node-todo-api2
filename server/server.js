
require('./config/config');


const express=require('express');
const bodParser=require('body-parser');
const _=require('lodash');



var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {ObjectId}=require('mongodb');
var {authenticate}=require('./middleware/authenticate');

const port=process.env.PORT;



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

//get all todoz
app.get('/todoz',(req,res)=>{

   Todo.find().then((todo)=>{
       res.status(200).send({todo});
   },(err)=>{
   res.status(400).send(err);
   });
});

//get todoz by id

app.get('/todoz/:id',(req,res)=>{

    // var valid=ObjectId.isValid(req.params.id);

    // if(valid)return res.status(404).send('Invalid id');

    var id=req.params.id;
    if(!ObjectId.isValid(id))return res.status(404).send();

    Todo.findById(id).then((todo)=>{

        if(!todo)return res.status(404).send();

        return res.send({todo});



    }).catch((e)=>res.status(400).send(e));

});

//delete the todoz

app.delete('/todoz/:id',(req,res)=>{
    //get the id
    var _id =req.params.id;

    //validate the id -> not valid return 404 back
    if(!ObjectId.isValid(_id))return res.status(404).send();

    //remove by id
    Todo.findByIdAndRemove(_id).then((todo)=>{

        if(!todo)return res.status(404).send();

         res.status(200).send({todo});

    }).catch((e)=>res.status(400).send());
});

//update todoz

app.patch('/todoz/:id',(req,res)=>{

    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);

    if(!ObjectId.isValid(id))return res.status(404).send();

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();

    }else{
        body.completed=false;
        body.completedAt=null;

    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo)return res.status(404).send();

        return res.status(200).send({todo});

    }).catch((e)=>res.status(400).send());

});

//Post users

app.post('/userz',(req,res)=>{
    var body=_.pick(req.body,['email','password']);

    var user=new User(body);

    user.save().then((user)=>{

       return user.generateAuthToken();
        // res.send({user});
    }).then((token)=>{
        res.header('x-auth',token).send({user});

    }).catch((e)=>res.status(400).send(e));
});



app.get('/userz/me',authenticate,(req,res)=>{
     res.send(req.user);
});

app.listen(port,()=>{
    console.log(`Started up to port ${port}`);
});

module.exports={app};
