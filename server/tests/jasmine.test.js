const expect=require('expect');
var {app}=require('./../server')
var request=require('supertest');


describe('First one',function(){
    
    before(function(){
        this.foo=0;
        this.foo++;
        console.log('Before each')
    });
    it('It should add ',function(){
       expect(this.foo).toEqual(1).toBeA('number');
              console.log('test/spec');

       
    });


    after(function(){
        this.foo=0;
        console.log('After')
    });

    before(()=>{
        console.log('***** second before');

    });
    it('Test two each',function(){

    });
    after(function(){
        console.log('**** Second after');
    });
});