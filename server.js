import express from "express";
import Pusher from "pusher";
import cors from "cors";
import mongoose from "mongoose";
import "./mondoData.js";


// app config
const app = express();
const port = process.env.PORT || 7000;
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
})

// api routes
app.get('/', (req, res) => res.status(200).send("Backend is working on 🚀"));

// listen to something

app.listen(port, () => console.log(`This runs on ${port}`));



// TscmXQF2LuppZh4X

