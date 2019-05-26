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

//Render the saved page
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

router.put("/saved/article/:id", (req, res) => {
    let articleId = req.params.id;

    Article.findOneAndUpdate({ _id: articleId }, { $set: { saved: true } })
    .then((result) => {
        res.json(result);
    });
});

router.put("/delete/article/:id", function(req, res) {
    let articleId = req.params.id;
  
    Article.findOneAndUpdate({ _id: articleId },{ $set: { saved: false }})
    .then((result) => {
      res.json(result);
    });
  });



module.exports = router;