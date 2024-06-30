import express from "express";
import ffmpeg from "fluent-ffmpeg";  // this is a CLI (COMMAND LINE INTERFACE) tool 

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// This is just basically query after http://localhost:3000/.....
// below is an example
// app.get("/cool", (req, res) =>{
//     res.send("Cool World!!!");
// });

app.post("/process-video", (req, res) => {
    // Get path of the input video file from the request body
    const inputVideoPath = req.body.inputFilePath;
    const outputVideoPath = req.body.outputFilePath;

    if (!inputVideoPath) {
        res.status(400).send("Bad request, missing input video path");
    }
    if (!outputVideoPath) {
        res.status(400).send("Bad request, missing output video path");
    }

    ffmpeg(inputVideoPath)
        .outputOptions('-vf', "scale=-1:360") // converting to 360p
        .on("end", () => {
            return res.status(200).send("Video processing finished successfully.");
        })
        .on("error", (err) => {
            console.log(`An error occured: ${err.message}`)
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputVideoPath)
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});