var store = require("../services/notesStore.js");
var RESPONSE_SUCCESS = "OK";
var RESPONSE_FAIL = "NOK";

module.exports.getAllNotes = function (req, res) {

  store.all(function (err, notes) {

    var jsonData = notes;
    res.end(JSON.stringify(jsonData));;

  });
};

module.exports.addNote = function (req, res) {

  var jsonData = {};

  store.add(req.body, function (err, doc) {

    try {
      jsonData["_id"] = doc._id;
      jsonData["status"] = RESPONSE_SUCCESS;
    } catch (e) {
      jsonData["status"] = RESPONSE_FAIL;
    }
    res.end(JSON.stringify(jsonData));

  });
};

module.exports.getNote = function (req, res) {

  var jsonData = {};

  store.get(req.params.id, function (err, doc) {
    try {
      jsonData = doc;
      jsonData["status"] = RESPONSE_SUCCESS;
    } catch (e) {
      jsonData["status"] = RESPONSE_FAIL;
    }
    res.end(JSON.stringify(jsonData));
  });
};

module.exports.updateNote = function (req, res) {

  var jsonData = {};

  store.update(req, function (err, numReplaced, upsert) {

    if(!err) {
      jsonData["status"] = RESPONSE_SUCCESS;
    }else {
      jsonData["status"] = RESPONSE_FAIL;
    }
    res.end(JSON.stringify(jsonData));
  });
};

module.exports.deleteNote = function (req, res) {

  var jsonData = {};

  store.delete(req.params.id, function (err, numRemoved) {
    if(!err) {
      jsonData["status"] = RESPONSE_SUCCESS;
      console.log("Document "+req.params.id+" deleted");
    } else {
      jsonData["status"] = RESPONSE_FAIL;
      console.log("Delete of "+req.params.id+" failed!");
    }
    res.end(JSON.stringify(jsonData));
  });
};
