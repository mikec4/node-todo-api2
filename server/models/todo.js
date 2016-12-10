var {mongoose}=require('./../db/mongoose');




var Schema=mongoose.Schema({
    text:{
        type:String,
        required:true,
        minLength:1,
        

    },
    completed:{
        type:String,
        default:true
    },
    completedAt:{
        type:Number,
        default:null
    }
});



var Todo=mongoose.model('Todo',Schema);



module.exports={Todo};