const express = require('express');
const Joi = require('joi');

const app = express();
const PORT = 3000;



app.use(express.json());

const courses = [
    {id:1, name:'course1'}
]

app.get('/', (req, res) => {
    res.send('Hello Express.js1');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id == req.params.id );
    if(!course) res.status(404).send("Course not found for given courseId");
    res.send(course);
});


app.post('/api/courses', (req, res) => {
    console.log('HITIT', req.body);
    const course = {
        id:courses.length + 1,
        name : req.body.name
    }
    courses.push(course);

    res.send(course);
});

app.listen(3000, () => {
    console.log('You are lissining 3000...');
});