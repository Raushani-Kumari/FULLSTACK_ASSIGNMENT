const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/'; // Change this to your MongoDB URI

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret';

async function connectToMongoDB() {
    try {
        // Connect to MongoDB
        const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB');

        // Access the database
        const db = client.db('User_Data'); // Change this to your database name

        // Access the users collection
        const usersCollection = db.collection('users');

        // Return the collection
        return usersCollection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Middleware for authentication
async function authenticate(req, res, next) {
    // Get the JWT token from the Authorization header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token and extract user data
        const userData = jwt.verify(token, JWT_SECRET);
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// Route for user signup
app.post('/signup', async (req, res) => {
    const { fname, lname, phone, email, password, confirmPassword } = req.body;

    if (!fname ||!phone || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please provide complete details' });
    }

    try {
        // Connect to MongoDB and get the users collection
        const usersCollection = await connectToMongoDB();
        let username = fname+lname;
        // Check if username or email already exists
        const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user data to the database
        await usersCollection.insertOne({ username, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: '1h' });

        // Return success message and token
        res.status(200).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for fetching posts (requires authentication)
app.get('/posts', authenticate, (req, res) => {
    // Dummy posts data
    const posts = [
        { id: 1, title: 'Post 1', content: 'Lorem ipsum dolor sit amet' },
        { id: 2, title: 'Post 2', content: 'Consectetur adipiscing elit' }
        // Add more posts as needed
    ];

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Slice posts array to return paginated data
    const paginatedPosts = posts.slice(startIndex, endIndex);

    res.status(200).json(paginatedPosts);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));