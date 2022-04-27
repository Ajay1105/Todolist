const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
require('dotenv').config()


//mongo and mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;
const uri = process.env.MONGO;
try {
    mongoose.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log("Mongoose is connected")
    );

} catch (e) {
    console.log("could not connect");
}
const itemSchema = new mongoose.Schema({
    id: Number,
    name: String
});
const Item = mongoose.model('Item', itemSchema);


var itemData = [];
var workItem = [{ name: "buy food" }, { name: "cook food" }, { name: "eat food" }];

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today = new Date();
var samay = today.toLocaleDateString("hi-IN", options);

app.get("/", (req, res) => {
    Item.find((err, food) => {

        if (err) { console.log(err) }
        itemData = food;

        res.render('list', { today: samay, inputData: itemData })
    });
});

app.post("/", (req, res) => {
    var input = req.body.newItem;
    const item = new Item({
        name: `${input}`
    });
    item.save();
    res.redirect("/")
});


app.get("/work", (req, res) => {
    res.render('list', { today: "Work List", inputData: workItem })
});

app.post("/work", (req, res) => {
    var input = req.body.newItem;
    var jsInput = { name: `${input}` };
    workItem.push(jsInput)
    res.redirect("/work")
});

app.post("/delete", (req, res) => {
    const checkboxId = req.body.checkbox;
    Item.findByIdAndRemove(checkboxId, function (err, doc) {
        if (err) {
            console.log(err)
        };
    });
    res.redirect("/");
});

    app.listen(3000, () => {
        console.log("server running on port 3000")
    });