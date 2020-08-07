// express allows routing whereas Http does not
const express = require('express');
const db = require('./database'); // grab our database

const server = express();

server.use(express.json());

// generate a random token 
const buildToken = () => {
    const token = Math.random().toString(36).substring(Math.floor(Math.random() * Math.floor(5)));
    return token + Math.random().toString(25).substring(Math.floor(Math.random() * Math.floor(7)));
}

server.get('/', (req, res) => {
    //generate a token 
    const token = buildToken() + buildToken();

    // send Hello World! msg to the client  
    res.json(
        {
            message: 'Hello World!! From my new express server',
            token: token  // send back a token because we should
        });
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
        const userId = req.params.id;
    const user = db.getUserById(userId);
    
    if (user) {
        res.json(user);
    } else if (!user) {
            res.status(500);
            res.json({
                errorMessage: 'User not found.',
            });
        
    } else {
        res.status(404);
        res.json({
            errorMessage: 'The user ID is invalid',
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

        // make sure the user is not already in the db
        if (!db.users.find(o => o.user === newUser)) {
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

    //if (!db.users.includes(user)) {
    if (!user) {
        res
            .status(404)
            .json({ errorMessage: `User with ID:${userId} does not exist.` });
    } else if (!req.body.name || !req.body.bio) {
        res
            .status(400)
            .json({ errorMessage: 'Name and bio are requiered fields.' });
    } else if (user && req.body.name && req.body.bio) {
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

    if (!user) {
        res
            .status(404)
            .json({ errorMessage: `The user with ID:${userId} does not exist.` });
    } else {
        db.deleteUser(user.id);
        res.status(204).json({ message: `User with ID:${userId} has been removed. ` });

    }
});


server.listen(3000, () => {
    console.log('server listening on port 3000');
});