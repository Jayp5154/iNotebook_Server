const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

var fetchUser = require("../middleware/fetchUser");

//ROUTE 1 : Get All the notes using : GET "/api/notes/fetchallnotes" Login require
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 2 : Add a new notes using : POST "/api/notes/addnote" Login require
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a Valid title").isLength({ min: 3 }),
    body("description", "Enter a Valid Email ").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      //Destructuring
      const { title, description, tag } = req.body;
      //If there is any error it will return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occutrd");
    }
  }
);

//ROUTE 3 : Update existing note : PUT "/api/notes/updatenote" Login require
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Create new note object
  try {
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //Find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Some error occutrd");
  }
});

//ROUTE 4 : DELETE an existing note : DELETE "/api/notes/deletenote" Login require
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Create new note object
  try {
    //Find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }
    //Allow delete if user is genuene
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note Deleted!!!!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Some error occutrd");
  }
});

module.exports = router;
