/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app, db) {
  
  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;

    })

    .post(function (req, res){
      var project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to = '', status_text = ''} = req.body
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
        status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      }, (err, r) => {
        if (err) return res.sendStatus(500)
        return res.json(r.ops[0])
      })
    })

    .put(function (req, res){
      var project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body
      
    })

    .delete(function (req, res){
      var project = req.params.project;

    });
};
