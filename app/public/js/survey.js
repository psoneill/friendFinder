$(document).ready(function () {
    //initialize questions array to build survey from
    var questions = ["My brain is always racing", "I like turtles", "I could binge Netflix for hours", "An overnight hiking trip sounds fun", "I would like to travel to remote places"
        , "I struggle with discipline", "I prefer to cook my own meals", "I am close with my family", "I prefer dogs to cats", "I get 8 hours of sleep per night"];
    //forEach function which loops through the provided questions
    questions.forEach((element, index) => {
        //initialize variables for question number, newQuestionTitle, newQuestion, and newRadioList
        var questionNumber = parseInt(index) + 1;
        var newQuestionTitle = $("<h3>Question " + questionNumber + ":</h3><hr>");
        var newQuestion = $("<h3>" + element + "</h3>");
        var newRadioList = $('<div>');
        //for used to create the 5 radio buttons assigned to each question
        for (let i = 1; i < 6; i++) {
            //radio button text is decided based on index due to radio buttons 1 and 5 having additional text components
            if (i === 1) {
                var newRadioItem = $('<label class="radio-inline pr-4"><input type="radio" data-score="' + i + '" name="radio' + index + '"> 1 (Strongly Disagree)</label>');
            } else if (i > 1 && i < 5) {
                var newRadioItem = $('<label class="radio-inline pr-4""><input type="radio" data-score="' + i + '" name="radio' + index + '"> ' + i + '</label>');
            } else {
                var newRadioItem = $('<label class="radio-inline pr-4""><input type="radio" data-score="' + i + '" name="radio' + index + '"> 5 (Strongly Agree)</label><hr>');
            }
            //add css to radio button label which decreases font size based on viewport height
            $(newRadioItem).css("fontSize", "1.5vh");
            //appends each radio button the the newRadioList div
            newRadioList.append(newRadioItem);
        }
        //creates a new div to contain the newly created question
        var newDiv = $("<div>");
        //appends the question Title, question, and radio button list to the new div
        newDiv.append(newQuestionTitle);
        newDiv.append(newQuestion);
        newDiv.append(newRadioList);
        //append the newDiv to the surveyRow found in the html body
        $("#surveyRow").append(newDiv);
    });

    //click event for when the submit button is clicked
    $("#btnSubmit").on("click", function (event) {
        //prevents the default actions of the button - stops page reload
        event.preventDefault();
        //declare array to hold user answer to the survey
        var userAnswers = [];
        //for each radio button with a name that starts with radio that is also currenty selected
        $('input[name^="radio"]:checked').each(function () {
            //pushes user score of selected answer to the userAnswers
            userAnswers.push($(this).data("score"));
        });
        //if statement to check if Name or PhotoLink inputs are empty
        if ($("#tbName").val().trim() === "" || $("#tbPhotoLink").val().trim() == "") {
            alert("Please Fill in name and/or photo link");
        } else if (userAnswers.length < 10) {
            //alerts if not all answers are input
            alert("Please fill in all answers");
        } else {
            //creates the userProfile for the completed survey
            var userProfile = {
                name: $("#tbName").val().trim(),
                photo: $("#tbPhotoLink").val().trim(),
                scores: userAnswers
            };
            //calls function to match the user
            matchUser(userProfile);
        }
    });
    //function which matches the user and then adds them to the data object
    function matchUser(userProfile) {
        //get API call to get all friends
        $.get("/api/friends").then(function (friendList) {
            //variable to save the object of currentBestFriend
            var currentBestFriend;
            //variable to save the lowest score
            var currentBestScore = 100;
            friendList.forEach(potentialMatch => {
                //potentialMatch's current score which resets to 0 each time
                var potentialScore = 0;
                //loops through the potentialMatch and user scores to calculate their compatibility
                for (let index = 0; index < 10; index++) {
                    potentialScore += Math.abs(userProfile.scores[index] - parseInt(potentialMatch.scores[index]));
                }
                //if statement to check if the new potentialMatch score is more compatible than the current score
                if (potentialScore < currentBestScore) {
                    //sets new currentBestScore and currentBestFriend on improved score
                    currentBestScore = potentialScore;
                    currentBestFriend = potentialMatch;
                }
            });
            //calculate match compatibility to show how close the user's answers were to their match
            var matchCompatibility = (40-currentBestScore)/40*100;
            //sets match name and image on popup modal
            $("#matchName").text(currentBestFriend.name + " ("+matchCompatibility+"% similar)");
            $("#matchImg").attr("src", currentBestFriend.photo);
            //posts new userProfile to api/friends and adds that user to the friends data object
            $.post("/api/friends", userProfile).then(function (data) {
                console.log("Added to database");
            });
            //clears the current form
            clearForm();
        });
    }

    function clearForm() {
        //clears all inputs with name starting with radio
        $('input[name^="radio"]').each(function () {
            //sets input select to false
            $(this).attr("checked", false);
        });
        //clears out both name and photoLink inputs
        $("#tbName").val("");
        $("#tbPhotoLink").val("");
    }
});