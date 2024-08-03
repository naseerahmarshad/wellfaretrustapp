import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dbwithoutpromise from '../database/db-withoutpromise.js';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

// User Registration
const register = (req, res) => {
    const { username, email, password, nickname } = req.body;

    // Validate inputs
    if (!username || !email || !password || !nickname) {
        return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim();
    const sanitizedNickname = nickname.trim();

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Insert user into database
        dbwithoutpromise.query('INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)', [sanitizedUsername, sanitizedEmail, hash, sanitizedNickname], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Username or email already exists' });
                }
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            return res.status(201).json({ message: 'User registered successfully' });
        });
    });
};


// changepassword
const changepassword = (req, res) => {
    const { username, newPassword } = req.body;

    // Validate inputs
    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Please provide username and new password' });
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim();

    // Hash new password
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing new password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Update password in database
        dbwithoutpromise.query('UPDATE users SET password = ? WHERE username = ?', [hash, sanitizedUsername], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'Password updated successfully' });
        });
    });
};

// user login
const login = (req, res) => {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim();

    // Fetch user from database
    dbwithoutpromise.query('SELECT * FROM users WHERE username = ?', [sanitizedUsername], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Example data to include in the token payload
            const data = {
                time: new Date(),
                user: user.username,
            };

            // Use the JWT secret key from environment variables
            const jwtSecretKey = process.env.ACCESS_TOKEN_SECRET;

            // Generate the JWT token
            const token = jwt.sign(data, jwtSecretKey, {expiresIn: "60m"});

            return res.status(200).json({ message: 'Login successful', token });
        });
    });
};


export { register, login, changepassword };
