import express from 'express';
import { resolve } from 'path';
const app = express();
const port = 3000;

app.use(express.static('./Frontend/build/'))

app.get("/hello", (req, res) => {
    res.send("hello");
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(resolve('./Frontend/build/index.html'));
});


app.listen(port, () => {
    console.log(`Appgateway app listening at http://localhost:${port}`);
});