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

    $.ajax("/saved/" + articleId, {
        type: "PUT"
    }).then(() => {
        console.log("Saved");
        location.reload();
    });
});

$(".deleteBtn").on("click", function(event) {
    event.preventDefault();

    let articleId = $(this).attr("data-id");

    $.ajax("/delete/" + articleId, {
        type: "PUT"
    }).then(() => {
        location.reload();
    });
});

$(".commentBtn").on("click", function(event) {
    event.preventDefault();

    //Grab the id of the article
    let articleId = $(this).attr("data-id");
    //Empty the body of the comment modal
    $(".commentModalBody").empty();
    $(".previous-comments-list").remove();
    
    //Get request to the 
    $.ajax("/saved/" + articleId, {
        type: "GET"
    }).then(function(result) {
        // for (var i = 0; i < result.comment.length; i++) {
        //     console.log("These are the comments " + result.comment[i]);
        // }
        console.log(result.comment, result.comment.length);
        //Modal result and adding card div
        $(".commentModalBody").append("<h5>").text("Notes for article: " + articleId);
        $(".commentModalBody").append("<br>");
        $(".commentModalBody").append("<div class ='card mt-2 mb-3' id='previous-comments-list'>");
        console.log(result);
        //only console loggin the id of the comment, not the comment itself;
        //Create comment input form for modal
        let newForm = $("<form>");
    
        //Create comment body
        let formBody = $("<div>", {class: 'form-group'});
        let formBodyLabel = $("<label for='bodyinput'>")
        let textArea = $("<textarea>", {id:'bodyinput', rows:'10', name: 'textArea', placeholder:'Add a new comment'});     
        formBody.append(formBodyLabel);
        formBody.append(textArea);
        
        //Add the article id to the save note button
        $(".saveNoteBtn").attr("data-id", result._id);
        //Attach title and body to the form
        newForm.append(formBody);
        //Attach form to the modal body
        $(".commentModalBody").append(newForm);

        //Build a comments array
        let commentsArray = [];
        let currentComment;

        if (!result.comment.length) {
            currentComment = $("<li class='list-group-item'>No comment yet</li>")
            commentsArray.push(currentComment);
        } 
        else {
            for (var i = 0; i < result.comment.length; i++) {
                console.log(result.comment[i]);
                // currentComment = $("<li class='list-group-item'>")
                // .text(result.comment[i])
                // .append($("<button class='btn btn-danger note-delete'>x</button>"));
            
                // currentNote.children("button").data("_id", result.comment[i]._id);
                // commentsArray.push(currentComment);
            }
        }
         $("#previous-comments-list").append(commentsArray);
    });
});


$(".saveNoteBtn").on("click", function(event) {

    event.preventDefault();
    //Grab the id of the article
    let articleId = $(this).attr("data-id");
    //New comment object to add value to. 
    const newComment = {
        comment: $("#bodyinput").val()
    }

    //If the fields have been filled out properly, then save it to the article
    if (newComment.comment) {
        $.post("/saved/" + articleId, newComment)
        .then(function(result) {
            console.log(result.comment);
        });
    } 
    else {
        alert("Please fill out all the fields")
    };
    //Empty the input values
    $("#bodyinput").val("");
});

$(document).on("click", ".note-delete", function(event) {
    
    // let commentToDelete = $(this).attr("data-id");
    // console.log(noteToDelete);

    // let parentDiv = event.target.parentElement.parentElement;
    
    // $.ajax({
    //     url: "/comments/" + commentToDelete,
    //     method: "DELETE"
    // }).then(function() {
    //     console.log("Deleted");
    //     parentDiv.remove();
    // })
})
