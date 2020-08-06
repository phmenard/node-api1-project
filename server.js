// express allows routing whereas Http does not
const express = require('express');
const db = require('./database'); // grab our database

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    // send a hello msg  
    res.json({ message: 'Hello World!! From my new express server' });
});

server.get('/users', (req, res) => {
    // attempt to retrieve all users  
    const users = db.getUsers();
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(500);
        res.json({ errorMessage: 'The users information could not be retrieved.' });
    }
});

server.get('/users/:id', (req, res) => {
    // Attempt to retreive a user by id
    const users = db.getUsers();
    const userId = req.params.id;
    const user = db.getUserById(userId);

    if (users && user) {
        res.json(user);
    } else if (users && !user) {
        res.status(404);
        res.json({
            errorMessage: 'The user ID is invalid',
        });
    } else if (!users) {
        res.status(500);
        res.json({
            errorMessage: 'User not found.',
        });
    }
});

server.post('/users', (req, res) => {
    // Attempt to create a new user
    if (!req.body.name || !req.body.bio) {
        return res
            .status(400)
            .json({ errorMessage: 'Name and bio are requiered fields.' });
    } else {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio,
        });
        if (db.users.includes(newUser)) {
            res.status(201).json(newUser);
        } else {
            res.status(500).json({
                errorMessage:
                    'ERROR: Unable to save new user to DB',
            });
        }
    }
});

server.put('/users/:id', (req, res) => {
    // Attempt to update a user
    const userId = req.params.id;
    const user = db.getUserById(userId);

    if (!db.users.includes(user)) {
        res
            .status(404)
            .json({ errorMessage: `User with ID:${userId} does not exist.` });
    } else if (!req.body.name || !req.body.bio) {
        res
            .status(400)
            .json({ errorMessage: 'Name and bio are requiered fields.' });
    } else if (db.users.includes(user) && req.body.name && req.body.bio) {
        db.updateUser(user.id, {
            name: req.body.name || user.name,
            bio: req.body.bio || user.bio,
        });
        res.status(200).json(db.users);
    }
});


server.delete('/users/:id', (req, res) => {
    // Attemp to remove a user by id
    const userId = req.params.id;
    const user = db.getUserById(userId);

    if (!db.users.includes(user)) {
        res
            .status(404)
            .json({ errorMessage: `The user with ID:${userId} does not exist.` });
    } else {
        db.deleteUser(user.id);
        res.status(204).json({ message: `User with ID:${userId} has been removed. ` });
        if (db.users.includes(user)) {
            res.status(500).json({ errorMessage: `User with ID:${userId} could not be removed.` });
        } else {
            res.status(204).json({ message: `User with ID:${userId} removed.` });
        }
    }
});


server.listen(3000, () => {
    console.log('server started at port 3000');
});