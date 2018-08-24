/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var mongo = require('mongodb')

chai.use(chaiHttp);

/* global before afterEach suite test */

let db

before('Connect to db', function(done) {
  mongo.connect(process.env.DB, (err, _db) => {
    if (err) throw err
    db = _db
    done()
  })
})

afterEach('Delete test data', function(done) {
  db.collection('issues').deleteMany({ project: 'test' }, done)
})

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.project, 'test')          
          assert.equal(res.body.issue_title, 'Title')          
          assert.equal(res.body.issue_text, 'text')          
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')          
          assert.equal(res.body.assigned_to, 'Chai and Mocha')          
          assert.equal(res.body.status_text, 'In QA')          
          assert.property(res.body, 'created_on')          
          assert.property(res.body, 'updated_on')          
          assert.equal(res.body.open, true)          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title2',
            issue_text: 'text2',
            created_by: 'dev2'
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body.project, 'test')          
            assert.equal(res.body.issue_title, 'Title2')
            assert.equal(res.body.issue_text, 'text2')
            assert.equal(res.body.created_by, 'dev2')
            assert.equal(res.body.assigned_to, '')
            assert.equal(res.body.status_text, '')
            assert.property(res.body, 'created_on')          
            assert.property(res.body, 'updated_on')          
            assert.equal(res.body.open, true)          
            done()
          })
      });
      
      test('Missing required fields', function(done) {
        const requiredFields = ['issue_title', 'issue_text', 'created_by']
        let count = 0
        requiredFields.forEach(field => {
          chai.request(server)
            .post('/api/issues/test')
            .send({ [field]: 'text' })
            .end((err, res) => {
              assert.equal(res.status, 400)
              if (++count >= requiredFields.length) {
                done()
              }
            })
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      let _id 
      
      this.beforeEach('Prepare some data', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'title',
            issue_text: 'text',
            created_by: 'me'
          })
          .end((err, data) => {
            if (err) throw err
            _id = data._id
            done()
          })
      })
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400)
            assert.equal(res.text, 'no updated field sent')
            done()
          })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ _id, issue_title: 'title3' }) 
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ _id, issue_title: 'title4', issue_text: 'text4' }) 
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'successfully updated')
            done()
          })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      this.beforeEach('Prepare some data', function (done) {
        const issues = [
          {
            issue_title: 'title',
            issue_text: 'text',
            created_by: 'me'
          },
          {
            issue_title: 'title10',
            issue_text: 'text10',
            created_by: 'me10'
          }
        ]
        let count = 0
        issues.forEach(issue => {
          chai.request(server)
            .post('/api/issues/test')
            .send(issue)
            .end((err, res) => {
              if (++count >= issues.length) {
                done()
              }
            })
        })
      })
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'title10' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtLeast(res.body.length, 1);
            assert.equal(res.body[0].issue_title, 'title10')
            assert.equal(res.body[0].issue_text, 'text10')
            assert.equal(res.body[0].created_by, 'me10')
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'title10', issue_text: 'text10', created_by: 'me10' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtLeast(res.body.length, 1);
            assert.equal(res.body[0].issue_title, 'title10')
            assert.equal(res.body[0].issue_text, 'text10')
            assert.equal(res.body[0].created_by, 'me10')
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {

      let _id
      
      this.beforeEach('Prepare some data', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'title',
            issue_text: 'text',
            created_by: 'me'
          })
          .end((err, data) => {
            if (err) throw err
            _id = data._id
            done()
          })
      })

      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400)
            assert.equal(res.text, '_id error')
            done()
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({ _id })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'deleted ' + _id)
            chai.request(server)
              .get('/api/issues/test')
              .query({ _id })
              .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.body.length, 0)
                done()
              })
          })
      });
      
    });

});
