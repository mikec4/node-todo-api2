// const {SHA256} =require( 'crypto-js');
// // const jwt=require('jsonwebtoken');
// const jwt =require( 'jsonwebtoken');
const bcrpt=require('bcryptjs');

var password='Mike';

// bcrpt.genSalt(10,(err,salt)=>{
//     console.log('salt',salt);
//     bcrpt.hash(password,salt,(err,hash)=>{
//         console.log('hash',hash);
//     })
// });


bcrpt.genSalt(10).then((salt)=>{
      console.log('salt',salt);

     return bcrpt.hash(password,salt);

}).then((hash)=>{
          console.log('hash',hash);
      }).catch((e)=>console.log('error',e));
 

// // var value="I'm Mike and am here";

// // var hash=SHA256(value).toString();

// // console.log(hash);

// var person={
//     name:'Mike',
//     age:25
// };

// jwt.sign(person,'Mike',{ algorithm: 'RS256' },function(e,t){
// console.log(t);

// });


// var decoded=jwt.verify(token,'Mike');
// console.log('decoded',decoded);