const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const fs = require('fs');

app.use(express.json());

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req,res) => {
  // res.send('This is home router');
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req,res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {

    // If there's an error when reading the file
    if (err) res.status(500).send('There was an error reading user.json file');

    try {
      const users = JSON.parse(data);
      res.json(users);
    }
    catch (err) {
      res.status(500).send('There was an error parsing the user.json file');
    }
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req,res) => {
  console.log(req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ status: false, message: 'Username and password are required' });
  }

  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading user.json file');
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username);
    console.log(user);

    if (!user) {
      return res.json({ status: false, message: 'The username is not valid' });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: 'The password is not valid' });
    }

    return res.json({ status: true, message: 'The user is valid' });
    
  });
  // res.send('This is login router');
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout', (req,res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  res.send(`Username ${username} successful logout.`);
  // res.send('This is logout router');
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err,req,res,next) => {
  console.error(err);
  res.status(500).send('Server Error');
});

app.get('/error', (req, res) => {
  throw new Error('This is a test error');
})

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));