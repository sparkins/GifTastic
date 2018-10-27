// Waits for the DOM to load before running the js.
$(document).ready(function () {

    // Initial array of topics
    var topics = ["Halloween", "Pumpkin", "Ghost", "Vampire", "Trick or Treat"];
    var apikey = "U7nHHiiuTxMnrQGKSmcld4QmTrkN2UHg";
    var rating = "R";
    var limit = 5;
    var topic = "";
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apikey + "&q=" + topic + "&limit=" + limit + "&offset=0&rating=" + rating.toUpperCase() + "&lang=en";

    // This function handles events where the add topic button is clicked
    $("#add-topic").on("click", function (event) {
        event.preventDefault();
        // This line of code will grab the input from the textbox
        topic = $("#topic-input").val().trim();
        console.log(topic, rating, limit);
        var newTopicsArr = _.map(topics, function (element) { return element.toLowerCase() });
        var newTopic = topic.toLowerCase();;

        // The topic from the textbox is then added to our array, unless it already exists
        if (_.contains(newTopicsArr, newTopic)) {
            alert("Mark you thought you could break me :)....  Sorry dude not adding that topic as it already exists");
        }
        else {
            topics.push(topic);
            $("#topic-input").empty();
        }

        // Calling renderButtons which handles the processing of our topic array
        renderButtons();

    });

    // Adding click event listeners to all elements with a class of "topic"
    $(document).on("click", ".topic-btn", displayGifs);

    // Capture limit when user changes the number of gifs to display
    $("#limit-pref").change(function () {
        limit = $("#limit-pref").val();
        console.log("limit= "+limit);
    })

    // Capture rating when user changes the rating of gifs to display
    $("#rating-pref").change(function () {
        rating = $("#rating-pref").val().toUpperCase();
        console.log("rating= "+rating);
    })

    // Detects when a gif is clicked and it will handle the playing and pausing of the gifs
    $("body").on('click', '.gif', (function () {

        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // console.log("gif click State: " + state);
        // Clicked image's state is still, update its src attribute to data-animate value.
        // Then, set the image's data-state to animate.  
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animated"));
            $(this).attr("data-state", "animate");

        // Else set src to the data-still value
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    }));

    // Function for displaying topic data
    function renderButtons() {

        // Deletes the topics prior to adding a new topic
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();

        _.each(topics, function (element) {
            // Then dynamicaly generates buttons for each topic in the array
            // console.log(topics);
            var btn = $("<button>");
            btn.addClass("btn btn-primary btn-md topic-btn");
            btn.attr("data-name", element);
            btn.text(element);
            $("#buttons-view").append(btn);
        });
    };

    // displayGifs function sends a response using the giphy api and then renders the retrieved gifs on the screen
    function displayGifs() {

        // Creating a variable 'Topic' to store the name of the topic button selected, to be used as part of the api request
        topic = $(this).attr("data-name");
        console.log ("display-gif: "+topic)

        //Clear out the existing gifs in preparaion to display the new ones requested
        // $("#gif-display").empty();

        // Create variables for apikey, queryURL

        queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apikey + "&q=" + topic + "&limit=" + limit + "&offset=0&rating=" + rating.toUpperCase() + "&lang=en";
        console.log("display-topic: "+queryURL);

        // AJAX GET call for the specific topic buttons being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // console.log("queryURL = " + queryURL);
            // console.log(response);

            // Display a title for the gifs selected
            $("#gif-title").text("You just added some '" + topic + "' Gifs");

            // parse each element of the response grabbing required data, and applying html and attributes and classes for displaying the gifs
            _.each(response.data, function (element) {
                // console.log(element);
                // Grab the rating and title info
                var gifRating = element.rating.toUpperCase();
                var gifTitle = element.title;
                // console.log("with " + gifRating + " rating");
                // console.log("and " + gifTitle + " title");

                // Create the image div, and add attributes for the still and animated image
                var gifImage = $("<img>")
                gifImage.attr("src", element.images.fixed_width_still.url);
                gifImage.attr("data-state", "still");
                gifImage.attr("data-still", element.images.fixed_width_still.url);
                gifImage.attr("data-animated", element.images.fixed_width.url);
                gifImage.addClass("gif");
                gifImage.height(150).width(150);

                // Create a div for title and ratings, to be displayed with the gif image
                var displayTitle = $("<div>").html("Title: " + gifTitle);
                displayTitle.addClass("gif-heading");
                var displayRating = $("<div>").html("Rating: " + gifRating);
                displayRating.addClass("gif-heading");

                // Create a display div, to package up the gif, title and rating 
                var gifDisplay = $("<div>");
                gifDisplay.addClass("gif");
                gifDisplay.append(displayTitle);
                gifDisplay.append("<br>");
                gifDisplay.append(displayRating);

                //Finally display the gif along with the details
                $("#gif-display").prepend(gifImage);
                $("#gif-display").prepend(gifDisplay);
            });
        });
    }

    // Calling the renderButtons function to display the intial buttons
    $("#gif-title").hide();
    renderButtons();

});