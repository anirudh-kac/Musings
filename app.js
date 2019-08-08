const express=require("express");
const app=express();
const bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));




app.get("/",function(req,res){
  res.render("index");
});

app.get("/read",function(req,res){
  res.render("read");
});
app.get("/post",function(req,res){
  res.render("post");
});
app.get("/contact",function(req,res){
  res.render("contact");
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});

/*app.listen(3000,()=>{
  console.log("Yippee");
});*/
