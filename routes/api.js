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

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var query = req.query
      req.query.open=req.query.open==='true';
      db.collection('issues').find(query).toArray().then((doc)=>{
        res.send(doc)
      })
    })
    
    .post(function (req, res,next){
      var project = req.params.project;
      var issue = req.body
      db.collection('issues').insertOne({issue_title:req.body.issue_title,issue_text:req.body.issue_text,created_on:new Date().toUTCString()
      ,updated_on:new Date().toUTCString(),created_by:req.body.created_by,assigned_to:req.body.assigned_to,status_text:req.body.status_text,open:true},(err,doc)=>{
        //console.log(doc)
        if(err) throw err;
        res.json(doc.ops[0])
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var issue = req.body;
      try{
      if(req.body.issue_title !==null){
        ['issue_title','issue_text','created_by','assigned_to','status_text'].forEach((i,index)=>{
        if(issue[i]!==""){
          db.collection('issues').findOneAndUpdate({_id: new ObjectId(issue._id)},{$set:{[i]:issue[i]}},{upsert:true,returnNewDocument:true})
        }
        else{
          db.collection('issues').findOneAndUpdate({_id: new ObjectId(issue._id)},{$setOnInsert:{i:issue[i]}},{upsert:true,returnNewDocument:true})
        }
      });
      } 
      db.collection('issues').findOneAndUpdate({_id: new ObjectId(issue._id)},{
          $set:{
        open:issue.open? false:true, 
        updated_on:new Date().toUTCString()
      }},{upsert:'true',returnNewDocument:true},(err,doc)=>{
        console.log(doc.value)
        res.send('Successfully Updated')
      })
      }
    catch(e){
      res.send('Wrong Id or something went wrong')
    }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var issue=req.body
      try{
        db.collection('issues').findOneAndDelete({_id: new ObjectId(issue._id)},(err,doc)=>{
          if (err) {res.send('Invalid Id')}
          else{res.send('Issue Deleted')}
        })
      }
      catch(e){
        res.send('Invalid Id')
      }
    //console.log(issue)
    });
    
};
/*,*/
