const express = require('express');
const app = express();

app.get('/test/index', (req, res) => {
   console.log('page visited');
   res.send('Hello World!');
});

app.listen(8081, () => {
   console.log('Server started.');
});