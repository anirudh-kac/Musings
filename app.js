const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");


app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//Array used for temporarily storing posts till database is integrated
const post1 = {
  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.",
  image: "image.jpeg",
  keyword: "key"
};

const post2 = {
  text: "thoughts thoushh hhd hha hha a mohfi iioadsyuf n shfiowf nmnosh h hsvhoishdv so isovhoishv osvhsiv ",
  image: "image.jpeg",
  keyword: "key"
}

const post3 = {
  text: "ayfiuu yfduywqf euyqwfu wufuwf w akagcua cacacuatuk gcuagtcu",
  image: "image.jpeg",
  keyword: "key"
}

const post4 = {
  text: "Posts are arranged in a grid manner and the page is responsive",
  image: "image.jpeg",
  keyword: "key"
}

const postsArray = [post1, post2, post3, post4];

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/read", function(req, res) {
  res.render("read", {
    posts: postsArray
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
  //parse the respone to get the input values
  const body = req.body;
// create the options variable to pass in the request
  const options = {
    url: "https://pixabay.com/api/",
    method: "GET",
    qs: {
      key: "api-key",
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
    if(data.hits===0)
    {
      console.log("No image found. Using default image");
      source="image.jpeg";
      console.log(source);
    }
    else
    {
      source=data.hits[0].webformatURL;
      console.log(source);
    }
  }
});

  const post = {
    text: body.text,
    image: source,
    keyword: body.keyword,
  }
  postsArray.push(post);
  res.render("submitted");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

/*app.listen(3000,()=>{
  console.log("Yippee");
});*/
