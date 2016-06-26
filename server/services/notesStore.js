/**
 * Created by isa on 19/06/16.
 */

var Datastore = require('nedb');
var db = new Datastore({filename: 'server/storage/notes.db', autoload: true});

function getAllNotes(callback) {

  try {
    db.find({}, function (err, docs) {
      callback(err, docs);
    });
  } catch (err) {
    console.log("error in notesStore.js, publicAll(): ")
  }
}

function addNote(content, callback) {

  //console.log("content in add: "+JSON.stringify(content));
  //works
  try {
    db.insert(content, function (err, newDoc) {

      if (callback) {
        callback(err, newDoc);
      }
    });
  } catch (err) {
    console.log("error in notesStore.js, addNote(): : " + err.toString());
  }
}

function getNote(id, callback) {

  try {
    db.findOne({_id: id}, function (err, doc) {
      callback(err, doc);
    });
  } catch (err) {
    console.log("error in notesStore.js, getNote(): " + err.toString());
  }
}

function updateNote(content, callback) {

  existing = {};
  try {
    getNote(content.params.id, function (err, note) {
      if (!err && note != null) {
        existing = note;

      } else if (err) {
        console.log("err while getting existing doc: " + err.toString());
      } else if (existing == null || existing == undefined) {
        console.log("couldn't get files from database in controller");
      }

      db.update({ _id: content.params.id}, content.body, {upsert:true}, function (err, numReplaced, upsert) {

          if (callback) {
            
            callback(err, numReplaced, upsert);
          }
        }
      );
    });
  }
  catch (err) {
    console.log("error in notesStore.js, publicUpdateNote(): : " + err.toString());
  }
}

function deleteNote(id, callback) {

  try {
    db.remove({_id: id}, {}, function (err, noRemoved) {
      callback(err, noRemoved);
    });
  } catch (err) {
    console.log("error in notesStore.js, deleteNote(): " + err.toString());
  }
}

module.exports = {all: getAllNotes, add: addNote, get: getNote, update: updateNote, delete: deleteNote};
