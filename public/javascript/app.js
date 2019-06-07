$("#scrapeBtn").on("click", function(event) {
    
    event.preventDefault();

    $.ajax("/scraped", {
        type: "GET"
    }).then(() => {
        console.log("Success!");
        window.location.href = "/articles";
    });
});


$(".saveArticleButton").on("click", function(event) {
    event.preventDefault();

    let articleId = $(this).attr("data-id");

    $.ajax("/saved/article/" + articleId, {
        type: "PUT"
    }).then(() => {
        console.log("Saved");
        location.reload();
    });
});

$(".deleteBtn").on("click", function(event) {
    event.preventDefault();

    let articleId = $(this).attr("data-id");

    $.ajax("/delete/article/" + articleId, {
        type: "PUT"
    }).then(() => {
        console.log("Deleted");
        location.reload();
    });
});

$(".commentBtn").on("click", function(event) {
    event.preventDefault();

    //Grab the id of the article
    let articleId = $(this).attr("data-id");
    //Empty the body of the comment modal
    $(".commentModalBody").empty();
    $(".noteAlert").remove();
    //Get request to the 
    $.ajax("/saved/" + articleId, {
        type: "GET"
    }).then(function(result) {
        //Modal result and adding list tag
        $(".commentModalBody").append("<p>" + result.title + "<p>");

        //Create form for modal
        let newForm = $("<form>");
    
        //Create comment title
        let formHead = $("<div>", {class: 'form-group'});
        let formHeadLabel = $("<label for='titleinput'>");
        let formHeadinput = $("<input id='titleinput' name='title' placeholder='Title'>");
        formHead.append(formHeadLabel);
        formHead.append(formHeadinput);
    
        //Create comment body
        let formBody = $("<div>", {class: 'form-group'});
        let formBodyLabel = $("<label for='bodyinput'>")
        let textArea = $("<textarea>", {id:'bodyinput', rows:'3', name: 'textArea', placeholder:'Comment'});     
        formBody.append(formBodyLabel);
        formBody.append(textArea);
        
        $(".saveNoteBtn").attr("data-id", result._id);
        //Attach title and body to the form
        newForm.append(formHead, formBody);
        //Attach form to the modal body
        $(".commentModalBody").append(newForm);

        let commentDiv = $(".previous-comments-list");
        let comment = $("<p>");
        comment.append(result.comment.comment);
        commentDiv.append(comment);

        //if there are comments, list them out to $(".noteList");
    });
});


$(".saveNoteBtn").on("click", function(event) {

    console.log("Save note button clicked");
    event.preventDefault();
    //Grab the id of the article
    let articleId = $(this).attr("data-id");

    //New comment object to add values to. 
    const newComment = {
        title: $("#titleinput").val(),
        comment: $("#bodyinput").val()
    }

    //If the fields have been filled out properly, then save it to the article
    if (newComment.title && newComment.comment) {``
        $.post("/saved/" + articleId, newComment)
        .then(function(result) {
            console.log("New comment posted successfully.");
        });
        $.get("/saved/" + articleId)
        .then(function(result) {
            console.log(result.comment);
        })
    } else {
        alert("Please fill out all the fields")
    };
    //Empty the input values
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


function deleteComment() {
    $(".deleteCommentBtn").on("click", function(event) {
        let articleId = $(this).attr("data-id");
        $.ajax("/comments/" + articleId, {
            type: "DELETE",
            success: function(result) {
                console.log("Deleted");
                location.reload();
            }
        });
    });
};