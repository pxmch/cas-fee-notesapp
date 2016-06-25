/**
 * Created by isa on 19/06/16.
 */

var Datastore = require('nedb');
var db = new Datastore({filename: 'server/storage/notes.db', autoload: true});

function publicUpdateNote(content, callback) {

  //works
  //db.update({_id: content._id},
  //console.log("id: "+content.params.id);
 existing = {}; //was 0 before
  try {
    publicGet(content.params.id, function (err, note) {
      if (!err && note != null) {
        existing = note;
        //console.log("doc from DB: " + JSON.stringify(existing));
      } else if (err) {
        console.log("err while getting existing doc: " + err.toString());
      } else if (existing == null || existing == undefined) {
        console.log("couldn't get files");
      }

      db.update({ _id: content.params.id}, content.body, {upsert:true}, function (err, numReplaced, upsert) {

          if (callback) {
            console.log("num of replaced: " + numReplaced);
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

function publicAddNote(content, callback) {

  //console.log("content in add: "+JSON.stringify(content));
  //works
  try {
    db.insert(content, function (err, newDoc) {

      if (callback) {
        callback(err, newDoc);
      }
    });
  } catch (err) {
    console.log("error in notesStore.js, publicAddNote(): : " + err.toString());
  }
}

function publicGet(id, callback) {

  try {
    db.findOne({_id: id}, function (err, doc) {
      callback(err, doc);
    });
  } catch (err) {
    console.log("error in notesStore.js, publicGet(): " + err.toString());
  }
}

function publicDelete(id, callback) {

  try {
    db.remove({_id: id}, {}, function (err, noRemoved) {
      callback(err, noRemoved);
    });
  } catch (err) {
    console.log("error in notesStore.js, publicDelete(): " + err.toString());
  }
}

function publicAll(callback) {

  try {
    db.find({}, function (err, docs) {
      callback(err, docs);
    });
  } catch (err) {
    console.log("error in notesStore.js, publicAll(): ")
  }
}

module.exports = {add: publicAddNote, get: publicGet, update: publicUpdateNote, delete: publicDelete, all: publicAll};
