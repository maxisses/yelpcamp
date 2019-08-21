var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/cat_app");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

/* var george = new Cat({
    name: "Mrs Norris",
    age: 7,
    temperatment: "evil"
}); */

/* george.save(function (err, result){
    if (err){
        console.log("error!!!");
    }
    else {
        console.log("We saved something to the db");
        console.log(result);
    }
}); */
/* Cat.create({
    name: "dieseKatze",
    age: 15,
    temperament: "wütend"
}, function(err, response){
    if(err){
        console.log(err)
    } else {
        console.log(response)
    }
}); */

Cat.find({}, function(err, response){
    if(err){
        console.log("failed");
        console.log(err)
    } else {
        console.log("All the cats: ");
        console.log(response)
    }
});

// adding a new cat to the DB

// retrieve all cats from the DB and console.log each