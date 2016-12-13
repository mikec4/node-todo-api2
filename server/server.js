const express=require('express');
const bodParser=require('body-parser');


var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {ObjectId}=require('mongodb');

const port=process.env.PORT || 3000;



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
    Todo.findByIdAndRemove(_id).then((document)=>{

        if(!document)return res.status(404).send();
        
         res.status(200).send(document);

    }).catch((e)=>res.status(400).send());
});

app.listen(port,()=>{
    console.log(`Started up to port ${port}`);
});

module.exports={app};