/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var _ = require('lodash')
var expect = require('chai').expect;

module.exports = function (app, db) {
  
  app.route('/api/issues/:project')

    .get(function (req, res){
      var project = req.params.project;
      const query = _.pickBy(req.query, (val, key) => { 
        return [
            '_id',
            'issue_title', 
            'issue_text', 
            'created_by', 
            'assigned_to', 
            'status_text', 
            'open'
          ].includes(key) && typeof val !== 'undefined'
      })
      query.project = project
      db.collection('issues').find(query).toArray((err, list) => {
        if (err) return res.sendStatus(500)
        res.json(list)
      })
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
      if (typeof issue_title === 'undefined' &&
          typeof issue_text === 'undefined' &&
          typeof created_by === 'undefined' &&
          typeof assigned_to === 'undefined' &&
          typeof status_text === 'undefined' &&
          typeof open === 'undefined') {
        return res.status(400).send('no updated field sent')
      }
      db.collection('issues').findAndModify(
        { _id },
        {},
        {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date()
        },
        { new: true },          
        (err, r) => {
          if (err) return res.sendStatus(500)
          if (!r.ok) return res.status(200).send('could not update ' + _id)
          res.status(200).send('successfully updated')
        })
    })

    .delete(function (req, res){
      var project = req.params.project;
      const { _id } = req.body
      if (!_id || _id.trim() === '') {
        return res.status(400).send('_id error')
      }
      db.collection('issues').deleteOne({ _id }, (err, r) => {
        if (err) return res.sendStatus(500)
        if (!r.result.ok) return res.status(200).send('could not delete _id ' + _id)
        res.status(200).send('deleted ' + _id)
      })
    });
};
