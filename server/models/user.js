const validator =require ('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');



var {mongoose}=require('./../db/mongoose');

var UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{value} is not the valid email'
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});




UserSchema.methods.generateAuthToken=function(){
    var user=this;

    var access='auth';
    var obj={
        _id:user._id.toHexString(),
        access
    }
    var token=jwt.sign(obj,'Mike');

    user.tokens.push(
        {
            access,token
        });

        return user.save().then(()=>{
             return token;
        });

};

UserSchema.statics.findByToken=function(token){
    var User=this;
    var decoded;

    try {
        decoded=jwt.verify(token,'Mike');

    } catch (error) {
        return Promise.reject();
    }

   var user= User.findOne({
        _id:decoded._id,
        'tokens.token':token,
         'tokens.access':decoded.access

    });
    return user;

};

UserSchema.methods.removeToken=function(token){

var user=this;

return user.update({
    $pull:{
        tokens:{token}
    }
}); 
};

UserSchema.methods.toJSON=function(){

  var user=this;
  var userObject=user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserSchema.pre('save',function(next){

  var user=this;
  
  if(user.isModified('password')){
     
     bcrypt.genSalt(10,(err,salt)=>{

         if(err) return Promise.reject();

         bcrypt.hash(user.password,salt,(err,hash)=>{

            if(err)return Promise.reject();
             user.password=hash;

              next();
         });
     });
  }else{
      next();
  }

});

UserSchema.statics.findByCredentials=function(email,password){

var User=this;

var user= User.findOne({email}).then((user)=>{

          if(!user)return Promise.reject();

       return new Promise((res,rej)=>{
          bcrypt.compare(password,user.password,(err,result)=>{
             
            if(result)res(user);

            else rej();

          });
       });
});
return user;
};



var User=mongoose.model('Users',UserSchema);

module.exports={User};

