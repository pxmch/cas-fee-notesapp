/**
 * Created by isa on 19/06/16.
 */

var express = require('express');
var router = express.Router();
var notes = require('../controller/notes.js');

router.get("/all", notes.getAllNotes);

router.post("/note", notes.addNote);

router.get("/note/:id", notes.getNote);

router.put("/note/:id", notes.updateNote);

router.delete("/note/:id", notes.deleteNote);

module.exports = router;
