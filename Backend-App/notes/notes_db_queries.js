import mysql from 'mysql2';
import sqlstring from 'sqlstring';
import dotenv from 'dotenv'
import db from '../database/db.js';
dotenv.config()

// Get all request
export async function getNotes() {
    const [rows] = await db.query("SELECT * FROM notes");

    // Iterate through each row and remove single quotes from each property
    const sanitizedRows = rows.map(row => {
        const sanitizedRow = {};
        for (const key in row) {
            if (Object.hasOwnProperty.call(row, key)) {
                if (typeof row[key] === 'string') {
                    sanitizedRow[key] = row[key].replace(/^'|'$/g, ''); // Remove leading and trailing single quotes
                } else {
                    sanitizedRow[key] = row[key]; // If not a string, keep the original value
                }
            }
        }
        return sanitizedRow;
    });
    return sanitizedRows;
}

// Get single request
export async function getNote(id) {
    const [rows] = await db.query(`
    SELECT * 
    FROM notes
    WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
        return null; // Return null if no note with the given id is found
    }

    // Remove single quotes from each property
    const sanitizedNote = {};
    for (const key in rows[0]) {
        if (Object.hasOwnProperty.call(rows[0], key)) {
            if (typeof rows[0][key] === 'string') {
                sanitizedNote[key] = rows[0][key].replace(/^'|'$/g, ''); // Remove leading and trailing single quotes
            } else {
                sanitizedNote[key] = rows[0][key]; // If not a string, keep the original value
            }
        }
    }

    return sanitizedNote;
}

// Create request
export async function createNote(title, contents, status) {
    // Input validation
    if (!title || !contents || !status) {
        throw new Error("Title and contents are required");
    }

    // Sanitize inputs
    title = sanitize(title);
    contents = sanitize(contents);
    status = sanitize(status);

    // Perform the database operation
    const [result] = await db.query(`
    INSERT INTO notes (title, contents, status)
    VALUES (?, ?, ?)
    `, [title, contents, status]);

    const id = result.insertId;
    return getNote(id);
}

// Function to update a note by ID
export async function updateNoteById(id, title, contents, status) {
    try {

        // Sanitize inputs
        title = sanitize(title);
        contents = sanitize(contents);
        status = sanitize(status);

        // Update the note in the database
        await db.query(`
            UPDATE notes 
            SET title = ?, contents = ?, status = ?
            WHERE id = ?
        `, [title, contents, status, id]);

        // Retrieve and return the updated note
        return await getNote(id);
    } catch (error) {
        // Handle any errors that occur during the update process
        throw error;
    }
}

// Sanitization function
function sanitize(input) {
    // Replace < and > characters with HTML entities
    input = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Escape single quotes to prevent SQL injection
    input = input.replace(/'/g, "\\");
    input = input.replace(/'/g, "''");
    
    // return input;
    return sqlstring.escape(input);    
}

// Delte request by ID
export async function deleteNoteById(id) {
    try {
        // Parse the id to ensure it's a number
        const noteId = parseInt(id);

        // Validate ID input
        if (isNaN(noteId) || noteId <= 0) {
            throw new Error('Invalid note ID');
        }

        // Delete the note from the database
        await db.query(`
            DELETE FROM notes 
            WHERE id = ?
        `, [id]);

        // Return a success message or any relevant data
        return { message: "Note deleted successfully." };
    } catch (error) {
        // Handle any errors that occur during the delete process
        console.error('Error deleting note:', error);
        throw new Error('Failed to delete note');
    }
}