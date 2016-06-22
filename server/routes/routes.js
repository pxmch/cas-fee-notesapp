/**
 * Created by isa on 19/06/16.
 */

var express = require('express');
var router = express.Router();
var notes = require('../controller/notes.js');

//query by calling: http://localhost:3001/notes
router.get("/notes", notes.getNotes);

//query by calling: http://localhost:3001/note/myTitle/myDescription/2/321/true
//will take finnishdate out --> is set when done
router.post("/note/:title/:description/:priority/:duedate/:isdone", notes.createNote);

//query by calling: http://localhost:3001/note/ (add some existing id see ../storage/notes.db)
router.get("/note/:id", notes.showNote);

//query by calling: http://localhost:3001/id/note/myTitle/myDescription/2/321/true/213
router.post("/note/update/:id/:title/:description/:priority/:duedate/:isdone", notes.updateNote);
//router.delete("/notes/:id/", notes.deleteNote);

module.exports = router;