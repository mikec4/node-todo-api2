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
  text:"maharage",
    completed:true,
  completedAt:333
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
 });

 describe('DELETE /todoz/:id',()=>{

 it('should remove a todo',(done)=>{
     var id=todos[0]._id.toHexString();
   request(app)
   .delete(`/todoz/${id}`)
   .expect(200)
   .expect((res)=>{
     expect(res.body.todo._id).toBe(id);

     
   })
   .end((err,res)=>{
     if(err)return done(err);

      Todo.findById(id).then((todo)=>{
         expect(todo).toNotExist();
         done();
      }).catch((e)=>done(e));
   });
 });

 it('should return 404 if todo not found',(done)=>{
         var id=new ObjectID().toHexString();
        request(app)
        .delete(`/todoz/${id}`)
        .expect(404)
        .end(done);
           
        });

  

 

 it('should return 404 if objectId is invalid',(done)=>{
    var id=1;
    request(app)
    .delete(`/todoz/id`)
    .expect(404)
    .end(done);
 })

 });


describe('PATCH /todoz/:id',()=>{
  
  it('should update the todo',(done)=>{
   
    var id=todos[0]._id;
     var text="This is my update";

    request(app)
    .patch(`/todoz/${id}`)
    .send({text,
      completed:true
    })
    .expect(200)
    .expect((res)=>{
       expect(res.body.todo.text).toBe(text);
       expect(res.body.todo.completed).toBe('true');
       expect(res.body.todo.completedAt).toBeA('number');

    })
    .end(done);
  });

  it('should clear completedAt when todo is not completed',(done)=>{
       var id=todos[1]._id;
     var text="This is my world";

    request(app)
    .patch(`/todoz/${id}`)
    .send({text,
      completed:false
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe('false');
      expect(res.body.todo.completedAt).toNotExist();

    })
    .end(done); 

  });
  
});