const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');

const jwt=require('jsonwebtoken');


const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const userThreeId=new ObjectID();
const userFourId=new ObjectID();


const users=[
  {
    _id:userOneId,
     email:'m1@example.com',
     password:'1234567',
     tokens:[
       {
         access:'auth',
         token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
       }
     ]
  },
  {
     _id:userTwoId,
     email:'m2@example.com',
     password:'1234567',
     tokens:[
       {
         access:'auth',
         token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
       }
     ]
}];

const todos=[{
  _id:new ObjectID,
  text:'Hello kido',
  _creator:userOneId
},
{
  _id:new ObjectID(),
  text:"maharage",
    completed:true,
  completedAt:333,
  _creator:userTwoId
},
{
  _id:new ObjectID(),
  text:'Beans',
  _creator:userThreeId
},
{
   _id:new ObjectID(),
  text:'Meat',
  _creator:userFourId
}];


const populateUsers=(done)=>{

 User.remove({}).then(()=>{
    var userOne=new User(users[0]).save();
    var userTwo=new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
 }).then(()=>{
   done();
 });

};
const populateTodos=(done)=>{
  Todo.remove().then(()=>{

    Todo.insertMany(todos).then((todo)=>{
        done();
    }).catch((e)=>done(e));

  });
}


module.exports={todos,populateTodos,users,populateUsers};
