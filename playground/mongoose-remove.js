const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {ObjectId}=require('mongodb');
const {User}=require('./../server/models/user');


// Todo.remove({}).then((result)=>{
//     console.log('removed ',result);
// })


// var _id="584fb2bde519cbcc08b72cd8";
// Todo.findByIdAndRemove(_id).then((result)=>{
//     console.log(result);
// }).catch((e)=>console.log(e));

Todo.findOneAndRemove({_id:'584fb2b7e519cbcc08b72cd7'}).then((result)=>console.log('findone and remove ',result));
