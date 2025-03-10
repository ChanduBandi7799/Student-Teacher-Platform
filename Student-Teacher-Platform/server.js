const express = require('express');
const path = require('path');
const { connectDB, User, TeacherUpdate } = require('./dbModels');

const app = express();

connectDB();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

let loggedInUser = null;

app.get('/post-update.html', (req, res) => {
    if (!loggedInUser || loggedInUser.role !== 'teacher') {
        return res.status(403).send('Access denied');
    }
    res.sendFile(path.join(__dirname, 'public', 'post-update.html'));
});

app.get('/view-posts.html', async (req, res) => {
    try {
        const posts = await TeacherUpdate.find();
        res.render('view-posts', { posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    loggedInUser = user;

    if (user.role === 'teacher') {
        return res.redirect('/post-update.html');
    } else if (user.role === 'student') {
        return res.redirect('/view-posts.html');
    }

    res.json({ msg: 'Login successful', role: user.role });
});

app.post('/signup', async (req, res) => {
    const { username, password, role, email } = req.body;
    const newUser = new User({ username, email, password, role });

    try {
        await newUser.save();
        res.json({ msg: 'Signup successful' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ msg: 'Error creating user', error });
    }
});

app.post('/teacher-post', async (req, res) => {
    const { teacherName, subject, content } = req.body;
    const newPost = await new TeacherUpdate({ teacherName, subject, content }).save();
    res.json(newPost);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
