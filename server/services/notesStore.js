/**
 * Created by isa on 19/06/16.
 */

var Datastore = require('nedb');
var db = new Datastore({filename: 'server/storage/notes.db', autoload: true});

function publicUpdateNote(content, callback) {

  //console.log(JSON.stringify(content));
  //works
  //db.update({_id: content._id},
var mydoc = null;
  try {
    this.get({_id: content._id}, function(err, note){
      if (!err && note != null) {
        mydoc = note;
      }else{
        console.log("err while getting existing doc: "+ err.toString());
      }
    });
     console.log("doc: "+JSON.stringify(mydoc)+", content: "+JSON.stringify(content));
    db.update(JSON.stringify(mydoc), JSON.stringify(content), {multi: false}, function (err, numReplaced) {

        if (callback) {
      console.log("num of replaced: " + numReplaced);
      callback(err, numReplaced);
    }
  }
);}
catch (err) {
  console.log("error in notesStore.js, publicUpdateNote(): : " + err.toString());
}
}

function publicAddNote(content, callback) {

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

function publicAll(callback) {

  try {
    db.find({}, function (err, docs) {
      callback(err, docs);
    });
  } catch (err) {
    console.log("error in notesStore.js, publicAll(): ")
  }
}

module.exports = {add: publicAddNote, get: publicGet, update: publicUpdateNote, all: publicAll};
