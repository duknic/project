/**
 * Created by nic on 02/07/2015.
 */

var questionSet = [];
var currentQinSet = 0;
var currentQid = '';
var currentLevel = 1;
var currentQscore = 0;
var currentAnswer = '';
var isEndLevel = false;

$(document).ajaxComplete(function () {

    displayTotalScore(levelData.total_score);
});

function nextQuestion() {
    if (currentQinSet < questionSet.length - 1) {
        currentQinSet++;
        currentQid = questionSet[currentQinSet]._id;
        if (currentQinSet == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
            isEndLevel = true;
        }
        $('#storyText').html(questionSet[currentQinSet].storText);
        $('#questionText').html(questionSet[currentQinSet].qText);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQinSet + 1));
        $('#prevButton').show();
        $('#nextButton').hide();
        $('#answerBox').val('');
        $('#nextButton').button('reset');

        // reset score to 10pts for next question
        currentQscore = 10;

        // populate pts avaiable for this question, accounting for previous attempts
        getValidScore(currentQid, currentLevel, currentQscore, function (score) {
            $('#questionPts').text(score + ' pts');
        });

        // initialise popovers on page
        $("[data-toggle=popover]").popover();


        displayTotalScore(levelData.total_score);
        var increment = (($('div.progress').outerWidth() / 100) * 33);
        var currentWidth = $('#level-progress-bar').width();
        $('#level-progress-bar').css("width", currentWidth + increment);


    } else {
        $(document).ajaxComplete(function () {
            $('#nextButton').button('reset');
            $('.modal-footer button').on('click', function () {
                // send endofLevel boolean to record function
                window.location.href = '/levels/' + (currentLevel + 1);
            });
            $('#badgeModal .modal-footer button').html('Level ' + (currentLevel + 1));
            $('#badgeModal').modal('show');
        });
        $('#level-progress-bar').css("width", $('div.progress').outerWidth());
        displayTotalScore(levelData.total_score);
    }

}

function prevQuestion() {

    if (currentQinSet > 0) {
        $('#nextButton').show();
        currentQinSet--;
        currentQid = questionSet[currentQinSet]._id;
        $('#storyText').html(questionSet[currentQinSet].storText);
        $('#questionText').html(questionSet[currentQinSet].qText);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQinSet + 1));
        if (currentQinSet == 0) {
            $('#prevButton').hide();
        }
        var decrement = (($('div.progress').outerWidth() / 100) * 33);
        var currentWidth = $('#level-progress-bar').width();
        if (currentWidth >= decrement) {
            $('#level-progress-bar').css("width", currentWidth - decrement);
        } else {
            $('#level-progress-bar').css("width", 0);
        }

        // reset score to 0pts for prev question because it has been completed
        currentQscore = 0;

        // initialise popovers on page
        $("[data-toggle=popover]").popover();

        // display total score data
        displayTotalScore(levelData.total_score);

        // any click of previous button means this is not end level
        isEndLevel = false;
    }
    else {
        alert("no more questions");
        $("#msg-box").empty();
    }
}

function initQuiz(questions, levelNum) {

    currentQid = questions[0]._id;
    currentLevel = levelNum;
    questionSet = questions;

    var level = "level" + currentLevel.toString();
    var question = currentQid + "";
    var recordedScore = levelData.progress[level][question].score;
    currentQscore = recordedScore ? recordedScore : 10;
    $('#questionPts').text(currentQscore + ' pts');

    if (questionSet != null) {
        $('#storyText').html(questionSet[0].storText);
        $('#questionText').html(questionSet[0].qText);
    }

    // initialise popovers on page
    $("[data-toggle=popover]").popover();


    displayTotalScore(levelData.total_score);
}

/*
 * Check Answer:
 * takes regex string from free text answerBox and checks it against correct and incorrect
 * possibilities from the current question in the questionSet
 */
function checkAnswer(answer) {

    //TODO maybe question object could have field to indicate if badge should be awarded upon correct/incorrect
    currentAnswer = answer;
    var q = questionSet[currentQinSet];
    var found = -1;
    for (var i = 0; i < q.misconceptions.length; i++) {
        if (q.misconceptions[i].regex == answer) {
            found = i;
        }
    }

    // if answer works as a regular expression
    if (testRegex(q, answer)) {
        if (answer == q.correctRes0.regex) {
            handleCorrectAnswer(q.correctRes0.feedback);
        }

        // else answer is correct but not the one we are looking for
        else {
            // if the answer in our list of misconceptions
            if (found > -1) {
                handleIncorrectAnswer(q.misconceptions[found].feedback);
            }
            // else answer is correct but not in our misconceptions
            else {
                // LOG UNCAUGHT CORRECT MISCONCEPTION IN DATABASE
                var url = "/recordMisconception/" +
                    currentQid + "/true/";
                url = encodeURI(url);
                $.post(url, {answer: currentAnswer}, function () {
                    console.log('logged uncaught correct misconception to database')
                });
                // print special message to user and mark answer as correct
                var uncaughtCorrectFb = "<p>Oh, sorry about this, you appear to have found a way of doing this that we hadn't considered. " +
                    "You're suggestion has been logged and may go towards improving the game, thanks!</p>" +
                    "<p>In the meantime, our suggested answer was: " + q.correctRes0.regex + "</p><hr/>" +
                    q.correctRes0.feedback;
                handleCorrectAnswer(uncaughtCorrectFb);
            }
        }
    }
    // ELSE ANSWER DOES NOT WORK AS REGULAR EXPRESSION
    else {
        // if the incorrect answer is in our list of misconceptions
        if (found > -1) {
            handleIncorrectAnswer(q.misconceptions[found].feedback);
        }
        else {
            // LOG UNCAUGHT INCORRECT MISCONCEPTION IN DATABASE
            var url = "/recordMisconception/" +
                currentQid + "/false/";
            url = encodeURI(url);
            $.post(url, {answer: currentAnswer}, function () {
                console.log('logged uncaught incorrect misconception to database')
            });
            handleIncorrectAnswer(q.incorrectRes0.feedback);
        }
    }
}

function handleCorrectAnswer(feedback) {
    recordUserProgress(true, currentQscore, currentAnswer, currentLevel, isEndLevel);
    writeFeedback(feedback, true);
    if (currentQinSet == questionSet.length - 1) {
        $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
    }
    $('#nextButton').show();
}

function handleIncorrectAnswer(feedback) {
    // print fail message with custom feedback
    writeFeedback(feedback, false);
    // if there are points available to deduct
    if (currentQscore > 0) {
        currentQscore = currentQscore - 2;
        // populate pts avaiable for this question
        $('#questionPts').text(currentQscore + ' pts');
        // record decremented score; it will never never be endLevel if incorrect answer
        recordUserProgress(false, currentQscore, currentAnswer, currentLevel, false);
    }
}

/*
 * writeFeedback:
 * displays a panel on the question page. Takes text to add to the body of the panel
 * and also a boolean to say where answer is right or wrong.
 */
function writeFeedback(text, isCorrect) {
    var out = "";
    if (isCorrect) {
        out = "<div class=\"panel panel-success\" id=\"thisPanel\"><div class=\"panel-heading\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"><\/span>CORRECT" +
            "<button type=\"button\" class=\"close\" data-target=\"#thisPanel\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><\/button><\/div>" +
            "<div class=\"panel-body\" aria-hidden=\"true\">" + text + "</div><\/div>";

    } else {
        out = "<div class=\"panel panel-danger\" id=\"thisPanel\"><div class=\"panel-heading\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"><\/span>WRONG" +
            "<button type=\"button\" class=\"close\" data-target=\"#thisPanel\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;<\/span><span class=\"sr-only\">Close<\/span><\/button><\/div>" +
            "<div class=\"panel-body\" aria-hidden=\"true\">" + text + "</div><\/div>";
    }
    $('#msg-box').append(out);
}

///*
// * clear answer box on focus and remove feedback panels
// */
//$('#answerBox').focus(function () {
//    $(this).val('');
//    $('#msg-box').empty();
//});

function recordUserProgress(completed, currentQscore, currentAnswer, currentLevel, isEndLevel) {

    var level = "level" + currentLevel.toString();
    var question = currentQid + "";

    // if this question has not already been marked as completed
    if (!levelData.progress[level][question].completed) {

        getValidScore(currentQid, currentLevel, currentQscore, function (score) {
            currentQscore = score;

            // completed is true if answer is correct, update total score
            if (completed) {
                levelData.total_score = (currentQscore + levelData.total_score);
                levelData.progress[level][question].completed = completed;
            }

            levelData.progress[level][question].score = currentQscore;
            levelData.progress[level][question].answer = currentAnswer.toString();

            if (isEndLevel) {
                levelData.progress.maxLevel = currentLevel + 1;
            }

            console.log('Recording for Qid: ' + question + ': \n     total score: ' + levelData.total_score +
                '\n     completed: ' + levelData.progress[level][question].completed +
                '\n     score: ' + levelData.progress[level][question].score +
                '\n     answer: ' + levelData.progress[level][question].answer);

            // send data to server
            $.ajax({
                url: "/updateUserProgress",
                type: "POST",
                data: JSON.stringify(levelData),
                contentType: "application/json; charset=utf-8",
                dataType: "html",
                success: function (data, res) {
                    console.log('posted levelData to server and got...' +
                        '\n      response: ' + res + '\n      data: ' + data);
                }
            });
        });
    }
    // else question is already marked as completed
    else {
        alert('Yo! Looks like you already recorded your score for this question.' + '\nPlay on you little minx...');
    }
}

function testRegex(question, answer) {
    var regex = new RegExp(answer);
    var passed = false;
    question.match.forEach(function (str) {
        passed += regex.test(str);
    });
    question.notMatch.forEach(function (str) {
        passed += !(regex.test(str));
    });
    return passed;
}