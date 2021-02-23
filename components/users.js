const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

let users = [
    {
        id: 1,
        username: 'tester',
        password: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', // testerpassword
    }
]



//register
router.post('/register', (req, res) => {
    if(req.body.username == false || req.body.password == false) {
        res.status(400);
        res.json({status: "Please fill all fields!"});
        return;
    }
    else {
        const username = users.find(u => u.username == req.body.username);
        if(username) {
            res.status(500).json({status:"username exist!"});
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 6);
        const newUser = {
            id: users.length + 1,
            username: req.body.username,
            password: hashedPassword
        }
        users.push(newUser);
        res.status(201).json({status: "created"});
        // res.send(newUser);
        // console.log(newUser.username);
    }
});

//login
router.get('/login', (req, res) => {
    if(req.body.username != false && req.body.password != false) {
        var username = req.body.username;
        var password = req.body.password;
        const user = users.find(u => u.username == username)
        if(user) {
            const tam = bcrypt.compareSync(password, user.password);
            if(tam == false) {
                res.status(500).json("wrong password");
            }
            else {
                res.status(201).json(user);
            }
        }
        else {
            res.send("username does not exist!");
        }
    }
    res.status(400);
    res.json({status: "please fill all  fields!"});
    return;
});

module.exports = router;