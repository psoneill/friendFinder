$(document).ready(function () {
    var questions = ["My brain is always racing", "I like turtles", "I could binge Netflix for hours", "An overnight hiking trip sounds fun", "I would like to travel to remote places"
        , "I struggle with discipline", "I prefer to cook my own meals", "I am close with my family", "I prefer dogs to cats", "I get 8 hours of sleep per night"];

    questions.forEach((element, index) => {
        var questionNumber = parseInt(index) + 1;
        var newQuestionTitle = $("<h3>Question " + questionNumber + ":</h3><hr>");
        var newQuestion = $("<h3>" + element + "</h3>");
        var newRadioList = $('<div>');
        for (let i = 1; i < 6; i++) {
            if (i === 1) {
                var newRadioItem = $('<label class="radio-inline pr-4"><input type="radio" data-score="' + i + '" name="radio' + index + '"> 1 (Strongly Disagree)</label>');
            } else if (i > 1 && i < 5) {
                var newRadioItem = $('<label class="radio-inline pr-4""><input type="radio" data-score="' + i + '" name="radio' + index + '"> ' + i + '</label>');
            } else {
                var newRadioItem = $('<label class="radio-inline pr-4""><input type="radio" data-score="' + i + '" name="radio' + index + '"> 5 (Strongly Agree)</label><hr>');
            }
            $(newRadioItem).css("fontSize", "1.5vh");
            newRadioList.append(newRadioItem);
        }


        var newDiv = $("<div>");
        newDiv.append(newQuestionTitle);
        newDiv.append(newQuestion);
        newDiv.append(newRadioList);
        $("#surveyRow").append(newDiv);
    });

    $("#btnSubmit").on("click", function (event) {
        event.preventDefault();

        var userAnswers = [];
        $('input[name^="radio"]:checked').each(function () {
            userAnswers.push($(this).data("score"));
        });

        if ($("#tbName").val().trim() === "" || $("#tbPhotoLink").val().trim() == "") {
            alert("Please Fill in name and/or photo link");
        } else if (userAnswers.length < 10) {
            alert("Please fill in all answers");
        } else {
            var userProfile = {
                name: $("#tbName").val().trim(),
                photo: $("#tbPhotoLink").val().trim(),
                scores: userAnswers
            };

            matchUser(userProfile);
        }
    });

    function matchUser(userProfile) {
        $.get("/api/friends").then(function (friendList) {
            var currentBestFriend;
            var currentBestScore = 100;
            friendList.forEach(potentialMatch => {
                var potentialScore = 0;
                for (let index = 0; index < 10; index++) {
                    potentialScore += Math.abs(userProfile.scores[index] - potentialMatch.scores[index]);
                }

                if (potentialScore < currentBestScore) {
                    currentBestScore = potentialScore;
                    currentBestFriend = potentialMatch;
                }
            });
            var matchCompatibility = (40-currentBestScore)/40*100;
            $("#matchName").text(currentBestFriend.name + " ("+matchCompatibility+"% similar)");
            $("#matchImg").attr("src", currentBestFriend.photo);

            $.post("/api/friends", userProfile).then(function (data) {
                console.log("Added to database");
            });

            clearForm();
        });
    }

    function clearForm() {
        $('input[name^="radio"]').each(function () {
            $(this).attr("checked", false);
        });
        $("#tbName").val("");
        $("#tbPhotoLink").val("");
    }
});