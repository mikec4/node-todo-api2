var {mongoose}=require('./../db/mongoose');




var UserSchema=mongoose.Schema({
    text:{
        type:String,
        required:true,
        minLength:1,
        

    },
    completed:{
        type:String,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});



var Todo=mongoose.model('Todo',UserSchema);



module.exports={Todo};