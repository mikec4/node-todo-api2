const expect=require('expect');
const request=require('supertest');
const assert=require('assert');
const {ObjectID}=require('mongodb');


const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');

const {todos,populateTodos,users,populateUsers}=require('./seed/seed');



beforeEach(populateUsers);
beforeEach(populateTodos);

 describe('POST /todoz',()=>{



      it('It should create new todos',(done)=>{
          var text='Hello mike congrats';

          request(app)
          .post('/todoz')
          .set('x-auth',users[0].tokens[0].token)
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
          .set('x-auth',users[0].tokens[0].token)
          .send({})
          .expect(404)
          .end((err,res)=>{
            if(err)return done(err);

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(4);
                done();

            }).catch((err)=> done(err));
          })
      });





 });



 describe('GET/todoz',()=>{

    it('It should get all todoz',(done)=>{

       request(app)
       .get('/todoz')
       .set('x-auth',users[0].tokens[0].token)
       .expect(200)
       .expect((res)=>{
         expect(res.body.todo.length).toBe(1);
       })
       .end(done);


    });
 });


 describe('GET/todoz/id',()=>{

   it('should return a todo document',(done)=>{

      request(app)
      .get(`/todoz/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);

      })
      .end(done);
   });

   it('should not return a todo document created by other user',(done)=>{

      request(app)
      .get(`/todoz/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
   })

   it('should return 404 if todo not found',(done)=>{
     //should return 404 if todo not found

      var _id=new ObjectID().toHexString();

      request(app)
      .get(`/todoz/${_id}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
   });
   it('should return 404 for non object Ids',(done)=>{
      // todoz/123

      var _id=12;
      request(app)
      .get(`/todoz/${_id}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
   });
 });

 describe('DELETE /todoz/:id',()=>{

 it('should remove a todo',(done)=>{
     var id=todos[1]._id.toHexString();
   request(app)
   .delete(`/todoz/${id}`)
   .set('x-auth',users[1].tokens[0].token)
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

  it('should not remove a todo created by other user',(done)=>{
     var id=todos[0]._id.toHexString();
   request(app)
   .delete(`/todoz/${id}`)
   .set('x-auth',users[1].tokens[0].token)
   .expect(404)
   .end((err,res)=>{
     if(err)return done(err);

      Todo.findById(id).then((todo)=>{
         expect(todo).toExist();
         done();
      }).catch((e)=>done(e));
   });
 });

 it('should return 404 if todo not found',(done)=>{
         var id=new ObjectID().toHexString();
        request(app)
        .delete(`/todoz/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);

        });





 it('should return 404 if objectId is invalid',(done)=>{
    var id=1;
    request(app)
    .delete(`/todoz/id`)
    .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
       expect(res.body.todo.text).toBe(text);
       expect(res.body.todo.completed).toBe('true');
       expect(res.body.todo.completedAt).toBeA('number');

    })
    .end(done);
  });

  it('should update first todo as the second user',(done)=>{

    var id=todos[0]._id;
     var text="This is my update";

    request(app)
    .patch(`/todoz/${id}`)
    .send({text,
      completed:true
    })
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
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
    .set('x-auth',users[1].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe('false');
      expect(res.body.todo.completedAt).toNotExist();

    })
    .end(done);

  });

});

describe('GET /userz/me',()=>{

  it('it should return user if authenticated',(done)=>{

    request(app)
     .get('/userz/me')
     .set('x-auth',users[0].tokens[0].token)
     .expect(200)
     .expect((res)=>{
       expect(res.body._id).toBe(users[0]._id.toHexString());
       expect(res.body.email).toBe(users[0].email);
     })
     .end(done);
  });

  it('it should return 401 if not authenticated',(done)=>{
   request(app)
   .get('/userz/me')
   .expect(401)
   .expect((res)=>{
     expect(res.body).toEqual({});

   })
   .end(done);
  });
});

describe('POST /userz',()=>{

  it('it should create user',(done)=>{

    var email='m3@example.com';
    var password='1234567';

     request(app)
     .post('/userz')
     .send({email,password})
     .expect(200)
     .expect((res)=>{
       expect(res.body.user.email).toExist();
       expect(res.body.user._id).toExist();
       expect(res.body.user.email).toBe(email);
     })
      .end((err)=>{
        if(err)return done(err);

        User.findOne({email}).then((user)=>{
           expect(user).toExist();
           expect(user.password).toNotBe(password);
           done();
        }).catch((e)=>done(e));

      });
  });
  it('it should return validation error if invalid request',(done)=>{

      var email='mama.com';
      var password='123';
       request(app)
       .post('/userz')
       .send({email,password})
       .expect(400)
       .end(done);
  });

  it('it should not create user if email in use',(done)=>{

  var email=users[0].email;
  var password='1234567'

     request(app)
     .post('/userz')
     .send({email,password})
     .expect(400)
     .end(done);
  });
});

describe('Post /userz/login',()=>{

  it('should login user and return auth token',(done)=>{

      request(app)
      .post('/userz/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{

         if(err)return done(err);

         User.findById(users[1]._id).then((user)=>{

           expect(user.tokens[1]).toInclude({
             access:'auth',
             token:res.headers['x-auth']
           });
          expect(user.email).toBe(res.body.user.email);
           done();
         }).catch((e)=>done(e));
      });
  });

  it('should reject invalid login',(done)=>{

  request(app)
      .post('/userz/login')
      .send({
        email:users[1].email,
        password:users[1].password+'mike'
      })
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{

         if(err)return done(err);

         User.findById(users[1]._id).then((user)=>{

           expect(user.tokens.length).toBe(1);

           done();
         }).catch((e)=>done(e));
      });
  });
});


describe('DELETE /userz/me/token',()=>{

it('should remove auth token on logout',(done)=>{
  
  
  request(app)
  .delete('/userz/me/token')
  .set('x-auth',users[0].tokens[0].token)
  .expect(200)
  .end((e,res)=>{
    if(e)return done(e);

    User.findById(users[0]._id).then((user)=>{
      expect(user.tokens.length).toBe(0);
      done();
    }).catch((e)=>done(e));
  })
});
});
