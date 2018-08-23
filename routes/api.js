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
          res.sendStatus(400)
        }
      })

      .put(function (req, res){
        var project = req.params.project;

      })

      .delete(function (req, res){
        var project = req.params.project;

      });
  });    
};
