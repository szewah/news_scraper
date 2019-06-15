const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const cheerio = require("cheerio");
const axios = require("axios");

//Render the home page
router.get("/", (req, res) => {
    res.render("index")
});

//Show articles on the home page
router.get("/articles", (req, res) => {
    Article.find({ saved: false }, (error, docs) => {
        if (error) {
            res.json(error);
        } else {
            res.render("index", { articles: docs })
        }
    });
});

//Show the saved page
router.get("/saved", (req, res) => {
    Article.find({ saved: true }, (error, docs) => {
        if (error) {
            res.json(error)
        } else {
            res.render("saved", { savedArticles: docs })
        }
    });
});

//Scrape news data and send it to the database
router.get("/scraped", (req, res) => {
    axios.get("https://www.npr.org/sections/news/").then((response) => {

        var $ = cheerio.load(response.data);

        let resultObj = {};

        $(".item-info-wrap").each((i, element) => {

            resultObj.title = $(element).find("h2").text();
            resultObj.summary = $(element).find("p").text();
            resultObj.link = $(element).find("a").attr("href");

            //Clear previous data
            Article.deleteMany({})
                .then((data) => {
                    console.log(data);
                }).catch(function(err) {
                    console.log(err);
                });

            //Create a new collection of documents
            Article.create(resultObj)
                .then((dbArticle) => {
                    console.log(dbArticle);
                }).catch((error) => {
                    console.log(error);
                });
        });
        res.send("Articles scraped")
    });
});

//Update to "saved" article
router.put("/saved/:id", (req, res) => {
    let articleId = req.params.id;

    Article.findOneAndUpdate({ _id: articleId }, { $set: { saved: true } })
    .then((result) => {
        res.json(result);
    });
});

//Update to delete the saved article
router.put("/delete/:id", (req, res) => {
    let articleId = req.params.id;
  
    Article.findOneAndUpdate({ _id: articleId },{ $set: { saved: false }})
    .then((result) => {
      res.json(result);
    });
  });

//Get all the comments
router.get("/comments", (req, res) => {
    Comment.find({}).then((response) => {
        console.log("This is finding ALL results " + response);
        res.json(response);
    });
});

//Get article by id
router.get("/saved/:id", (req, res) => {
    let articleId = req.params.id;
    Article.findOne({_id: articleId})
    .populate("comment")
    .then(dbComment => {
        // res.send("succeeded");
        res.json(dbComment);
    })
    .catch(err => {
        res.json(err);
    });
});

//Post a comment
router.post("/saved/:id", (req, res) => {
    Comment.create(req.body).then(dbComment => {
        return Article.findOneAndUpdate(
            {_id: req.params.id},
            { $push: {comment: dbComment._id}},
            {new: true, upsert: true}
        )
        .populate("comment")
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
    });
});

router.delete("/comments/:id", (req,res) => {
    Comment.findOneAndRemove({_id: req.params.id})
    .then(dbComment => {
        res.json(dbComment);
    })
    .catch((err) => {
        res.json(err);
    })
});


module.exports = router;