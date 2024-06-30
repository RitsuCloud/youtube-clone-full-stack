import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// This is just basically query after http://localhost:3000/.....
// below is an example
// app.get("/cool", (req, res) =>{
//     res.send("Cool World!!!");
// });

app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});