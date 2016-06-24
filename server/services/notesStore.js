/**
 * Created by isa on 19/06/16.
 */

var Datastore = require('nedb');
var db = new Datastore({filename: 'server/storage/notes.db', autoload: true});

function publicUpdateNote(content, callback) {

  //works
  //db.update({_id: content._id},
  //console.log("content: "+JSON.stringify(content.body));
console.log("id: "+JSON.stringify(content.params));

mydoc = null;
  try {
    publicGet(JSON.stringify(content.params), function(err, note){
      if (!err && mydoc != null) {
        mydoc = note;
        console.log("doc: "+JSON.stringify(mydoc));
      }else if(err){
        console.log("err while getting existing doc: "+ err.toString());
      }else if (mydoc == null){
        console.log("couldn't get files");
      }
    });
    db.update(JSON.stringify(mydoc), JSON.stringify(content.body), {multi: false}, function (err, numReplaced) {

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
