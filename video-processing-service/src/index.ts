import express from "express";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

// call set up to make sure directories exist;
setupDirectories();

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

app.post("/process-video", async (req, res) => {
    // Get the bucket and filename from the Clou Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.');
    }

    // Format of <UID>-<DATE>.<EXTENSION>
    const inputFileName = data.name; 
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];

    if (!isVideoNew(videoId)) {
        return res.status(400).send('Video already processing or processed.');
    } else {
        await setVideo(videoId, {
            id: videoId,
            uid: videoId.split('-')[0],
            status: 'processing'
        })
    }

    // Download the raw video from Cloud storage
    await downloadRawVideo(inputFileName);
    
    // Convert the video
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (error) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ]);
        console.error(error);
        return res.status(500).send('Internal Server Error: video processing failed.');
    }

    // Upload processed video to cloud
    await uploadProcessedVideo(outputFileName);

    await setVideo(videoId, {
        status: 'processed',
        filename: outputFileName,
    })

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Process finished successfully.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});