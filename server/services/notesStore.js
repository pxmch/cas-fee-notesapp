/**
 * Created by isa on 19/06/16.
 */

var Datastore = require('nedb');
var db = new Datastore({filename: 'server/storage/notes.db', autoload: true});

function publicUpdateNote(content, callback) {

  try {
    db.update({_id: id},
      {
        $set: JSON.parse(content)

      }, {multi: true}, function (err, numReplaced) {
        if (callback) {
          //console.log("num of replaced: " + numReplaced);
          callback(err, numReplaced);
        }
      });

  } catch (err) {
    console.log("error in update: " + err.toString());
  }
  callback(null, null);
}

function publicAddNote(content, callback) {

  try {
    db.insert(content, function (err, newDoc) {

      if (callback) {
        callback(err, newDoc);
      }
    });
  }catch(err){
    console.log("error in create: " + err.toString());
  }
}

function publicGet(id, callback) {

  try {
    db.findOne({_id: id}, function (err, doc) {
      callback(err, doc);
    });
  }catch(err){
    console.log("error in gettgin one note: " + err.toString());
  }
}

function publicAll(callback) {

  try {
    db.find({}, function (err, docs) {
      callback(err, docs);
    });
  }catch(err){
    console.log("error in getting all notes")
  }
}

module.exports = {add: publicAddNote, get: publicGet, update: publicUpdateNote, all: publicAll};
