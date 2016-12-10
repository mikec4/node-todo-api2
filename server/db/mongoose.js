const mongoose=require('mongoose');


mongoose.Promise=global.Promise;
var url='mongodb://localhost:27017/TodoApp2';
mongoose.connect(url);

module.exports={mongoose};
