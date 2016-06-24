var store = require("../services/notesStore.js");
var RESPONSE_SUCCESS = "OK";
var RESPONSE_FAIL = "NOK";

module.exports.getNotes = function (req, res) {

  store.all(function (err, notes) {

    var jsonData = notes;
    res.end(JSON.stringify(jsonData));;

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

//refactored
module.exports.createNote = function (req, res) {

  var jsonData = {};

  store.add(req.body, function (err, doc) {

    console.log(JSON.stringify(doc._id));
    //-->id ist vorhanden im doc
    try {
      jsonData["_id"] = doc._id;
      jsonData["status"] = RESPONSE_SUCCESS;
    } catch (e) {
      jsonData["_id"] = "no id";
      jsonData["status"] = RESPONSE_FAIL;
    }
    res.end(JSON.stringify(jsonData));

  });
};

//refactored
module.exports.showNote = function (req, res) {

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


