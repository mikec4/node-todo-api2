const {SHA256} =require( 'crypto-js');
// const jwt=require('jsonwebtoken');
const jwt =require( 'jsonwebtoken');

// var value="I'm Mike and am here";

// var hash=SHA256(value).toString();

// console.log(hash);

var person={
    name:'Mike',
    age:25
};

var token=jwt.sign(person,'Mike');

console.log(token);

// var decoded=jwt.verify(token,'Mike');
// console.log('decoded',decoded);