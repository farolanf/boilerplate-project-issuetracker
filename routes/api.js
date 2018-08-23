/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app, cb) {
  
  MongoClient.connect(CONNECTION_STRING, (err, db) => {

    //Sample front-end
    app.route('/:project/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/issue.html');
      });

    //Index page (static HTML)
    app.route('/')
      .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
      });

    app.route('/api/issues/:project')

      .get(function (req, res){
        var project = req.params.project;

      })

      .post(function (req, res){
        var project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
        if ((!issue_title || issue_title.trim() === '') ||
            (!issue_text || issue_text.trim() === '') ||
            (!created_by || created_by.trim() === '')) {
          return res.sendStatus(400)
        }
        db.collection('issues').insertOne({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
        }, (err, r) => {
          if (err) return res.sendStatus(500)
          return res.json(r.ops[0])
        })
      })

      .put(function (req, res){
        var project = req.params.project;

      })

      .delete(function (req, res){
        var project = req.params.project;

      });
    
    cb()
  });    
};
