/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  MongoClient.connect(CONNECTION_STRING, (err, db) => {
    console.log('database connected')
    
    app.route('/api/issues/:project')

      .get(function (req, res){
        var project = req.params.project;

      })

      .post(function (req, res){
        var project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.params
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
  });    
};
