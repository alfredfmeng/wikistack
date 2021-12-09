const express = require('express');
const app = express();
const morgan = require('morgan');
const layout = require('../views/layout');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
    res.send(layout(''));
});

const PORT = 1337;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});