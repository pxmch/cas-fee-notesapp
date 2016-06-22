/**
 * Created by isa on 19/06/16.
 */
//here comes most part of the server.js

var Datastore = require('nedb');
var db = new Datastore({filename: './storage/notes.db', autoload: true});


function Note(title, description, priority, duedate, isdone) {
    this.title = title;
    this.description = description;
    this.createdate = new Date().getTime();
    this.priority = parseInt(priority);
    this.duedate = (new Date(parseInt(duedate))).getTime();
    this.isdone = new Boolean(isdone);
}

function publicUpdateNote(id, title, description, priority, duedate, isdone, callback) {

    /*try {
        db.update({_id: id}, $set {
            title: title, description: description, priority: parseInt(priority),
            duedate: (new Date(parseInt(duedate))).getTime(), isdone: !!isdone, finishdate: (new Date(finishdate)).getTime()


        }, {}, function (err, numReplaced) {
            if (callback) {
                console.log("num of replaced: " + numReplaced);
                callback(err, numReplaced);
            }
        });
    }catch(err){
        console.log("error in update: "+err.toString())
    }*/
    callback(null, null);
}

function publicAddNote(title, description, priority, duedate, isdone, callback) {

    var note = new Note(title, description, priority, duedate, isdone);
    db.insert(note, function (err, newDoc) {
        if (callback) {
            callback(err, newDoc, note.state);
        }
    });
}

function publicRemove(id, callback) {
    db.update({_id: id}, {$set: {"state": "DELETED"}}, {}, function (err, doc) {
        publicGet(id, callback);
    });
}

function publicGet(id, callback) {
    db.findOne({_id: id}, function (err, doc) {
        callback(err, doc);
    });
}

function publicAll(callback) {
    db.find({}, function (err, docs) {
        callback(err, docs);
    });
}

module.exports = {add: publicAddNote, delete: publicRemove, get: publicGet, update: publicUpdateNote, all: publicAll};