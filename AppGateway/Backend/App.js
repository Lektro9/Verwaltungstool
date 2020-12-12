import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('../Frontend/dist/'))

app.get("/hello", (req, res) => {
    res.send("hello");
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});