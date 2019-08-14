const express = require("express");
const app = express();
const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true
}))
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/messages", {
  useNewUrlParser: true
});
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const CommentSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Comments must be Identified(Persons Name)"]},
    message: {type: String, required: [true, "Comments cant be Left Blank"]},
}, {timestamps: true})

const MessageSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Messages must be Identified(Persons Name)"]},
    message: {type: String, required: [true, "Messages cant be left Blank"]},
    comments: [CommentSchema]
}, {timestamps: true})


const Message = mongoose.model("Message", MessageSchema);
const Comment = mongoose.model("Comment", CommentSchema);

app.get("/", (req, res) =>{
    console.log("im home")
    Message.find()
    .then(data => res.render("index", { messages: data }))
    .catch(err => res.json(err));
})

app.post("/messages", (req,res) => {
    console.log(req.body);
    const message = new Message();
    message.name = req.body.name;
    message.message = req.body.message;
    message
        .save()
        .then(newMessageData => {
        console.log("Message Added: ", newMessageData);
        console.log("Im redirecting home with message");
        res.redirect("/")
        })
        .catch(err => console.log(err));
});

app.post("/message/:id", (req,res) => {
  console.log("i made it to update function");
 console.log(req.body);
  Message.updateOne({_id: req.params.id}, {
  
    $push:{comments: {name: req.body.name, message: req.body.message}}
  } )
  .then(data => res.redirect(`/`))
  .catch(err => res.json(err));

})

app.listen(8000, () => console.log("You are on MessageDashboard App"));