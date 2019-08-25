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

mongoose.connect("mongodb://localhost:27017/musings",{useNewUrlParser:true});

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




//Array used for temporarily storing posts till database is integrated

// the time for default posts are set such that they dont expire for long time
/*const post1 = {
  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.",
  image: "image.jpeg",
  keyword: "key",
  time:111565969694937
};

const post2 = {
  text: "thoughts thoushh hhd hha hha a mohfi iioadsyuf n shfiowf nmnosh h hsvhoishdv so isovhoishv osvhsiv ",
  image: "image.jpeg",
  keyword: "key",
  time:111565969694937
}

const post3 = {
  text: "ayfiuu yfduywqf euyqwfu wufuwf w akagcua cacacuatuk gcuagtcu",
  image: "image.jpeg",
  keyword: "key",
  time:111565969694937
}

const post4 = {
  text: "Posts are arranged in a grid manner and the page is responsive",
  image: "image.jpeg",
  keyword: "key",
  time:111565969694937,
}

const postsArray = [post1, post2, post3, post4];*/

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/about",function(req,res){
  res.render("about");
});
app.get("/read", function(req, res) {

  // passing currentTime to avoid printing expired posts

  Post.find({},function(err,postsArray){
    console.log(postsArray);
    res.render("read", {
      posts: postsArray,
      currentTime:currentTime,
    });
  });



  /*res.render("read", {
    posts: postsArray,
    currentTime:currentTime,
  });*/

});

app.get("/post", function(req, res) {
  res.render("post");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});


app.post("/post", function(req, res) {
  var source;
  //parse the respone to get the input values
  var body = req.body;

  console.log(body.text);

// set the default values to the post object
// we need to store the date so as to check if post has expired
  /*const post = {
    text: body.text,
    image: "image.jpeg",
    keyword: body.keyword,
    time:currentTime,

  }*/


// create the options variable to pass in the request
  const options = {
    url: "https://pixabay.com/api/",
    method: "GET",
    qs: {
      key: apiKey,
      q: body.keyword,
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

// the below commented code doesn't work because request may not even be completed when source is assigned to post.image
  /*const post = {
    text: body.text,
    image: source,
    keyword: body.keyword,
  }*/

//  postsArray.push(post);




});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

/*app.listen(3000,()=>{
  console.log("Yippee");
});*/
