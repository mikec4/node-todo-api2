var {mongoose}=require('./../db/mongoose');

var Schema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minLength:1
    }
});

var User=mongoose.model('Users',Schema);

module.exports={User};

