var store = require("../services/notesStore.js");

module.exports.getNotes = function (req, res) {

  store.all(function (err, notes) {

    res.type("application/json");
    res.header("Access-Control-Allow-Origin", "*");

    res.write("[");

    for (i = 0; i < notes.length; i++) {

      res.write("{");
      res.write("\"_id\": ")

      res.write("\"");
      res.write(notes[i]._id.toString());
      res.write("\",");

      res.write("\"title\": ")

      res.write("\"");
      res.write(notes[i].title.toString());
      res.write("\",");

      res.write("\"description\": ")

      res.write("\"");
      res.write(notes[i].description.toString());
      res.write("\",");

      res.write("\"createdate\": ")

      res.write("\"");
      res.write(notes[i].createdate != null ? notes[i].createdate.toString() : "null");
      res.write("\",");

      res.write("\"priority\": ")

      res.write("\"");
      res.write(notes[i].priority.toString());
      res.write("\",");

      res.write("\"duedate\": ")

      res.write("\"");
      res.write(notes[i].duedate != null ? notes[i].duedate.toString() : "null");
      res.write("\",");

      res.write("\"isdone\": ")

      res.write("\"");
      res.write(notes[i].isdone.toString());
      res.write("\",");

      res.write("\"finishdate\": ")

      res.write("\"");
      res.write(notes[i].finishdate != null ? notes[i].finishdate.toString() : "null");
      res.write("\"");

      res.write("}");
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

  store.update(req.params.id, req.params.title, req.params.description,
    req.params.priority, req.params.duedate, req.params.isdone,
    function (err, note) {

      res.type('application/json');
      res.write("[");
      res.write("{");

      res.write("\"status\":");

      res.write("\"");
      res.write(err != null ? err.toString() : "OK");
      res.write("\"}");

      res.end("]");
    });
};


module.exports.createNote = function (req, res) {

  //ruft funktion add im notesStorage auf
  //console.log("req = "+JSON.stringify(req.body));
  res.type("application/json");
  res.header("Access-Control-Allow-Origin", "*");


  store.add(req.body.title, req.body.description, req.body.priority,
    req.body.duedate, req.body.isdone, function (err, note, status) {

      res.write("[");
      res.write("{");
      res.write("\"_id\":");

      res.write("\"");
      res.write(note._id.toString());
      res.write("\",");


      res.write("\"status\":");

      res.write("\"");
      res.write(err != null ? err.toString() : "OK");
      res.write("\"}");

      res.end("]");
    });
};

module.exports.showNote = function (req, res) {

  res.type("application/json");
  res.header("Access-Control-Allow-Origin", "*");
  //ruft funktion get im notesStorage auf
  store.get(req.params.id, function (err, note) {
    res.write("[");
    res.write("{");
    res.write("\"_id\":")

    res.write("\"");
    res.write(note._id.toString());
    res.write("\",");

    res.write("\"title\":")

    res.write("\"");
    res.write(note.title.toString());
    res.write("\",");

    res.write("\"description\":")

    res.write("\"");
    res.write(note.description.toString());
    res.write("\",");

    res.write("\"createdate\":")

    res.write("\"");
    res.write(note.createdate != null ? note.createdate.toString() : "null");
    res.write("\",");

    res.write("\"priority\":")

    res.write("\"");
    res.write(note.priority.toString());
    res.write("\",");

    res.write("\"duedate\":")

    res.write("\"");
    res.write(note.duedate != null ? note.duedate.toString() : "null");
    res.write("\",");

    res.write("\"isdone\":")

    res.write("\"");
    res.write(note.isdone.toString());
    res.write("\",");

    res.write("\"finishdate\":")

    res.write("\"");
    res.write(note.finishdate != null ? note.finishdate.toString() : "null");
    res.write("\"");
    res.end("}]");
  });
};

module.exports.deleteNote = function (req, res) {
  store.delete(req.params.id, function (err, note) {
    res.type('application/json');
    res.write("<html>");
    res.write("<p>Note-Number: " + note._id + "</p>");
    res.write("<p>Status: " + err + "</p>");
    res.write("<form action='/' method='get'><input type='submit' value='Zurueck zum start'></form>");
    res.end("</html>");
  });
};


