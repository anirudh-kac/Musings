const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongoose =require("mongoose");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));


//connect to mongodb server
mongoose.connect("mongodb://localhost:27017/musings",{useNewUrlParser:true});

// Schema contains the structure of each document (post)
const musingsSchema=new mongoose.Schema({
  text:String,
  image:String,
  keyword:String,
  time:Number,
});

const Post = mongoose.model("Post",musingsSchema);

var apiKey="13278658-15b0b36268f67d711a6206dce";


// date
var date = new Date();
var currentTime=date.getTime();
console.log(currentTime);
// 1 day = 86400000 ms.


app.get("/", function(req, res) {
  res.render("index");
});

app.get("/about",function(req,res){
  res.render("about");
});
app.get("/read", function(req, res) {

  // passing currentTime to avoid printing expired posts
  //Post.find() queries the collection, err contains error , postsArray is array of matching documents

  Post.find({},function(err,postsArray){
    console.log(postsArray);
    res.render("read", {
      posts: postsArray,
      currentTime:currentTime,
    });
  });

});

app.get("/post", function(req, res) {
  res.render("post");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});


app.post("/post", function(req, res) {
  var source;
  var body=req.body;
// create the options variable to pass in the request
  const options = {
    url: "https://pixabay.com/api/",
    method: "GET",
    qs: {
      key: apiKey,
      q: req.body.keyword,
    },
  };

// make a get request to get the url of image
request(options,function(error,response,body){
  if(error){
    console.log(error);
  }
  else{
    var data=JSON.parse(body);
    if(data.total===0)
    {
      console.log("No image found. Using default image");
      source="image.jpeg";

      // create document, save and render submit
      const musingsPost=new Post({
        text:req.body.text,
        keyword:req.body.keyword,
        image:source,
        time:currentTime,
      });
      musingsPost.save();
      res.render("submitted");

    }
    else
    {
      source=data.hits[0].webformatURL;
      console.log(source);

        // create document, save and render submit
      const musingsPost=new Post({
        text:req.body.text,
        keyword:req.body.keyword,
        image:source,
        time:currentTime,
      });
      musingsPost.save();
      res.render("submitted");
    }
  }
});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
