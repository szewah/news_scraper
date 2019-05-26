$("#scrapeBtn").on("click", (event) => {
    
    event.preventDefault();

    $.ajax("/articles", {
        type: "GET"
    }).then(() => {
        console.log("Success!");
        window.location.href = "/articles";
    });
});


$(".saveArticleButton").on("click", (event) => {
    event.preventDefault();

    let articleId = $(".saveArticleButton").attr("data-id");

    $.ajax("/saved/article/" + articleId, {
        type: "PUT"
    }).then(() => {
        console.log("Saved");
        location.reload();
    });
});

$(".deleteBtn").on("click", (event) => {
    event.preventDefault();

    let articleId = $(".deleteBtn").attr("data-id");

    $.ajax("/delete/article/" + articleId, {
        type: "PUT"
    }).then(() => {
        console.log("Deleted");
        location.reload();
    });
});

