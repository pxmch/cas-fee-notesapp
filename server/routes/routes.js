/**
 * Created by isa on 19/06/16.
 */

var express = require('express');
var router = express.Router();
var notes = require('../controller/notes.js');

//query by calling: http://127.0.0.1:3001/notes
router.get("/all", notes.getNotes);

router.post("/new", notes.createNote);

//query by calling: http://127.0.0.1:3001/note/ (add some existing id see ../storage/notes.db)
router.get("/note/:id", notes.showNote);

//query by calling: http://127.0.0.1:3001/id/note/myTitle/myDescription/2/321/true/213
router.put("/update/:id", notes.updateNote);

router.delete("/delete/:id", notes.deleteNote);

module.exports = router;
