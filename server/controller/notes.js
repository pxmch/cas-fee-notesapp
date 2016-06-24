var store = require("../services/notesStore.js");

module.exports.getNotes = function (req, res) {

  store.all(function (err, notes) {

    res.type("application/json");
    res.header("Access-Control-Allow-Origin", "*");

    res.write("[");

    for (i = 0; i < notes.length; i++) {

      res.write(JSON.stringify(notes[i]));

      if (i + 1 < notes.length) {
        res.write(",");
      } else {
        continue;
      }
    }

    res.end("]");

  });
};

module.exports.updateNote = function (req, res) {

  //console.log("duedate: "+req.params.duedate);

  res.type("application/json");
  res.header("Access-Control-Allow-Origin", "*");

  store.update(req.body, function (err, note) {

      res.write("[");
      res.write("{");

      res.write("\"status\":");

      res.write("\"");
      res.write(err != null ? err.toString() : "SUCCESS");
      res.write("\"}");

      res.end("]");
    });
};


module.exports.createNote = function (req, res) {

  //ruft funktion add im notesStorage auf
  res.type("application/json");
  res.header("Access-Control-Allow-Origin", "*");

  store.add(req.body, function (err, doc) {

    //console.log(doc[0]._id);
    //-->id ist vorhanden im doc
    res.write("[{");
    res.write("\"_id\":");

    res.write("\"" + doc[0]._id + "\",");

    res.write("\"status\":");

    res.write("\"");
    res.write(err != null ? err.toString() : "SUCCESS");
    res.end("\"}]");

  });
};

module.exports.showNote = function (req, res) {

  res.type("application/json");
  res.header("Access-Control-Allow-Origin", "*");
  //ruft funktion get im notesStorage auf
  store.get(req.params.id, function (err, note) {

    res.write("["+ JSON.stringify(note));
    res.end("]");
  });
};


