import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import {getNotes, getNote, createNote, updateNoteById, deleteNoteById} from './notes/notes_db_queries.js'
import { register, login, changepassword } from './user_login_registration/userlogin.js';

const app = express();

app.use(express.json())

// CORS
app.use(cors());
// const corsOptions = {
//     origin: 'https://gridspective.com', // Replace with the allowed domain
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// }  
// app.use(cors(corsOptions));

// ================ user login & registration ================ 
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User Registration
app.post('/register', register);

// Update Password
app.put('/changepassword', changepassword);

// User Login
app.post('/login', login);
// ================ END OF user login & registration ================ 

// Validate token get API
app.get("/validateuser", validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.send(`${req.user.user} successfully accessed to the Website!`)
})

// validateToken function
function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
        res.status(403).send("Token invalid")
        }
        else {
        req.user = user
        next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()
}

// get all notes
app.get("/notes", async (req, res) => {
    // const notes = await getNotes()
    // res.send(notes)

    const status = req.query.status; // Get the value of the 'status' query parameter

    // Fetch notes based on the status, or fetch all notes if no status is provided
    let notes;
    if (status && status.toLowerCase() === 'published') {
        // Assuming getNotes() returns all notes, you can modify this according to your data source
        notes = (await getNotes()).filter(note => note.status.toLowerCase() === 'published');
    } else if (status && status.toLowerCase() === 'draft') {
        notes = (await getNotes()).filter(note => note.status.toLowerCase() === 'draft');
    } else if (status && status.toLowerCase() === 'trash') {
        notes = (await getNotes()).filter(note => note.status.toLowerCase() === 'trash');
    }
     else {
        notes = await getNotes(); // Fetch all notes
    }

    res.send(notes);
})

// get single note with id
app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

// create a note using post method with token validation and error handling
app.post("/notes", validateToken, async (req, res) => {
    try {
        const {title, contents, status} = req.body;

        // Check if title and contents are provided
        if (!title || !contents || !status) {
            return res.status(400).json({ error: "Both title and contents are required." });
        }
        const note = await createNote(title, contents, status);
        res.status(201).send(note);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});

// Put method to edit the id
app.put("/notes/:id", validateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, contents, status } = req.body;

        // Check if title and contents are provided
        if (!title || !contents || !status) {
            return res.status(400).json({ error: "Both title and contents are required." });
        }

        // Update the note in the database
        const updatedNote = await updateNoteById(id, title, contents, status);

        // Check if the note exists
        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found." });
        }

        // Return the updated note
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});

// Delete request
app.delete("/notes/:id", validateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the note from the database
        await deleteNoteById(id);

        // Return a success message
        res.status(200).json({ message: "Note deleted successfully." });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// App listen
app.listen(8080, () => {
    console.log('Server is running full-on port 8080!')
})