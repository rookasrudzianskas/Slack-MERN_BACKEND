import express from "express";
import Pusher from "pusher";
import cors from "cors";
import mongoose from "mongoose";
import mongoData from "./mondoData.js";


// app config
const app = express();
const port = process.env.PORT || 7000;

const pusher = new Pusher({
    appId: "1219798",
    key: "7fee001524c20788c95d",
    secret: "d94745559808ea82203f",
    cluster: "eu",
    useTLS: true
});



// middlewares

app.use(cors());
app.use(express.json());
// db config
const mongoURI = 'mongodb+srv://admin:TscmXQF2LuppZh4X@cluster0.lcjud.mongodb.net/backend-slack?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
    console.log("DB CONNECTION");

    // this watches for the changes here
    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on( (change) => {
        if(change.operationType === 'insert') {
            pusher.trigger("my-channels", "newChannel", {
                change: change
            });
        } else if (change.operationType === 'update') {

        }
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send("Backend is working on 🚀"));


app.post('/new/channel', (req, res) => {
    const dbData = req.body;

    mongoData.create(dbData, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.post('/new/message', (req, res) => {
    const id = req.query.id;
    const newMessage = req.body;

    mongoData.update(
        {_id: id},
        {$push: {conversation: newMessage }},

        (err, data) => {
            if(err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        }
    )
})

app.get('/get/channelList', (req, res) => {
    mongoData.find((err, data) => {
    if(err) {
        res.status(500).send(err);
    } else {
        let channels = [];

        data.map((channelData) => {
            const channelInfo = {
                id: channelData._id,
                name: channelData.channelName,
            }

            channels.push(channelInfo);
        })

        res.status(200).send(channels);
    }})
})


app.get('/get/conversation', (req, res) => {
    const id = req.query.id

    mongoData.find({_id: id}, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
})
// listen to something

app.listen(port, () => console.log(`This runs on ${port}`));



// TscmXQF2LuppZh4X

