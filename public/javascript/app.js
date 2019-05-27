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

$(".commentBtn").on("click", (event) => {
    event.preventDefault();

    //Grab the id of the article
    let articleId = $(".commentBtn").attr("data-id");
    //Empty the body of the comment modal
    $(".commentModalBody").empty();
    //Get request to the 
    $.ajax("/comments/" + articleId, {
        type: "GET"
    }).then((result) => {

        console.log(result);
        //Modal result and adding list tag

        // $(".commentModalBody").append("<h3>" + result.title + "<h3");
        let list = $("<ul>", {id:'notelist'})
        $(".commentModalBody").append(list);

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
    });
});

$(".saveNoteBtn").on("click", (event) => {
    event.preventDefault();
    let articleId = $(".saveNoteBtn").attr("data-id");

    $.ajax("/comments/" + articleId, {
        type: "POST",
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then((result) => {
        console.log(result);
        let noteAdded = $("<p>", {class:'noteAlert'});
        $(".alertDiv").append(noteAdded).text("Note addded successfully");
        //clear the input
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
});