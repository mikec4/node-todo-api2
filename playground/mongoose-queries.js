const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {ObjectId}=require('mongodb');
const {User}=require('./../server/models/user');




ObjectId.isValid();


// var _id="684e70270a2246b42a2b4ab9";

// if(!ObjectId.isValid(_id))
//  {
//     return 'Invalid Id';

// }
// // Todo.find({_id}).then((todos)=>{
// //     console.log(todos);
// // })
// // Todo.findOne({_id}).then((todo)=>{
// //     console.log(todo);
// // });

// Todo.findById(_id).then((todo)=>{
//     if(!todo)return console.log('Id not found');
//     console.log(todo);
// }).catch((err)=>console.log(err));

var _id="584c26fb20301e8c28c4ff85";
User.findById(_id).then((user)=>{
    if(!user)return console.log('not found user');
    return console.log(user);
},(e)=>console.log(e));
