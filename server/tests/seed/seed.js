const {ObjectID}=require('mongodb');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');

const jwt=require('jsonwebtoken');


const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users=[
  {
    _id:userOneId,
     email:'m1@example.com',
     password:'1234567',
     tokens:[
       {
         access:'auth',
         token:jwt.sign({_id:userOneId,access:'auth'},'Mike').toString()
       }
     ]
  },
  {
     _id:userTwoId,
     email:'m2@example.com',
     password:'1234567'
}];

const todos=[{
  _id:new ObjectID,
  text:'Hello kido'

},
{
  _id:new ObjectID(),
  text:"maharage",
    completed:true,
  completedAt:333
},
{
  _id:new ObjectID(),
  text:'Beans'
},
{
   _id:new ObjectID(),
  text:'Meat'
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
