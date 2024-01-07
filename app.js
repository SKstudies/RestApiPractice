//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

//set the view engine as ejs
app.set('view engine','ejs');

//using bodyparser for elemnt passing
app.use(bodyParser.urlencoded({extended: true}));

//use public folder for media components
app.use(express.static("public"));


//connection to local mongo
// mongodb+srv://braveunknown123:<password>@cluster0.1fphpch.mongodb.net/?retryWrites=true&w=majority
const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('MongoDB connected successfully');
});


//schema
const articleSchema = {
    title : String,
    content : String
}
//model
const Article = mongoose.model("Article", articleSchema);


//listen on port 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
});

/***************************************************** routing request for all articles *********************************************************/
app.route("/articles")
.get(function(req, res){
  const findArticle = Article.find({})
        findArticle.exec()
        .then((foundArticles)=>{
          console.log(foundArticles);
          res.send(foundArticles);
        } )
        .catch((err)=>{
          res.send(err);
          console.log(err);
        });
})

.post( function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save()
    .then(() => {
      console.log("Article saved successfully");
      res.send("Article saved successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
})

.delete(function(req,res){
  Article.deleteMany({})
  .then(()=>{
    res.send("Successfully Deleted  All Articles");
  })
  .catch((err)=>{
    res.send(err);
  });
});


/***************************************************** routing request for single article *********************************************************/
// app.route("/articles/:articleTitle")

app.route("/articles/:articleTitle")
  

  .get(function(req, res) {
    // Use Article.findOne() directly and handle errors properly
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.status(404).send("Article not found");
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })

  .put(function(req, res){
    const articleTitle = req.params.articleTitle;
  
    Article.replaceOne(
      { title: articleTitle },
      { title: req.body.title, content: req.body.content }
    )
    .then(() => {
        res.send("Successfully updated the content of the selected article.");
    })
    .catch(err => {
      res.status(500).send(err);
    });
  })
  
  .patch(function(req, res){

    const articleTitle = req.params.articleTitle;
  
    Article.updateOne(
      { title: articleTitle },
      { $set: { title: req.body.title, content: req.body.content } }
    )
    .then(() => {
        res.send("Successfully updated the content of the selected article.");
    })
    .catch(err => {
      res.status(500).send(err);
    });
  })

  .delete(function(req, res){
    Article.findOneAndDelete({title: req.params.articleTitle})
    .then(()=>{
      res.send("Successfully Deleted The Articles");
    })
    .catch((err)=>{
      res.send(err);
    });
  });
  
  
// .post(function(req, res){
//   if
// })
// app.get("/articles", );

// app.post("/articles",);

// app.delete("/articles",);