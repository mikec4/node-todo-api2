const expect=require('expect');
const request=require('supertest');
const assert=require('assert');
const {ObjectID}=require('mongodb');


const {app}=require('./../server');
const {Todo}=require('./../models/todo');


const todos=[{
  _id:new ObjectID,
  text:'Hello kido'
},
{
  _id:new ObjectID(),
  text:"maharage"
},
{  
  _id:new ObjectID(),
  text:'Beans'
},
{
   _id:new ObjectID(),
  text:'Meat'
}];


beforeEach((done)=>{
  Todo.remove().then(()=>{

    Todo.insertMany(todos).then((todo)=>{
        done();
    }).catch((e)=>done(e));
    
  });
});

 describe('POST /todoz',()=>{



      it('It should create new todos',(done)=>{
          var text='Hello mike congrats';

          request(app)
          .post('/todoz')
          .send({text})
          .expect(200)
          .expect((res)=>{
            expect(res.body.text).toBe(text);
          })
          .end((err,res)=>{
              if(err){
                  return done(err);
              }

              Todo.find({text}).then((todo)=>{
                expect(todo.length).toBe(1);
                expect(todo[0].text).toBe(text);
                done();
              }).catch((err)=>done(err));
          });
      });

      it('Should create todo with invalid body data',(done)=>{
          
          request(app)
          .post('/todoz')
          .send({})
          .expect(404)
          .end((err,res)=>{
            if(err)return done(err);

            Todo.find({}).then((todo)=>{
                expect(todo.length).toBe(4);
                done();

            }).catch((err)=> done(err));
          })
      });


   

     
 });



 describe('GET/todoz',()=>{
    
    it('It should get all todoz',(done)=>{

       request(app)
       .get('/todoz')
       .expect(200)
       .expect((res)=>{
         expect(res.body.todo.length).toBeGreaterThan(0);
       })
       .end(done);

       
    });
 });


 describe('GET/todoz/id',()=>{
   
   it('should return a todo document',(done)=>{
    
      request(app)
      .get(`/todoz/${todos[2]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[2].text);
      
      })
      .end(done);
   })

   it('should return 404 if todo not found',(done)=>{
     //should return 404 if todo not found

      var _id=new ObjectID().toHexString();

      request(app)
      .get(`/todoz/${_id}`)
      .expect(404)
      .end(done);
   });
   it('should return 404 for non object Ids',(done)=>{
      // todoz/123
      
      var _id=12;
      request(app)
      .get(`/todoz/${_id}`)
      .expect(404)
      .end(done);
   });
 })


