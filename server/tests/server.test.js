const expect=require('expect');
const request=require('supertest');
const assert=require('assert');


const {app}=require('./../server');
const {Todo}=require('./../models/todo');


beforeEach((done)=>{
  Todo.remove({}).then(()=>done());
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

              Todo.find().then((todo)=>{
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
                expect(todo.length).toBe(0);
                done();

            }).catch((err)=> done(err));
          })
      });

     
 });