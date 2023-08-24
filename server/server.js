const express = require('express');
const app = express();
const port = 4000;

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

