/**
 * Created by nic on 02/07/2015.
 */

var questionSet = [];
var currentQinSet = 0;
var currentQid = '';
var currentLevel = 1;
var currentQscore = 0;
var currentAnswer = '';

function initLevel(levelNum) {
    recordUserProgress(true, currentQscore, currentAnswer, currentLevel, true).done(function () {
        window.location.href = 'http://localhost:3000/levels/' + levelNum;
    });
}

function nextQuestion() {

    if (currentQinSet < questionSet.length - 1) {
        // record users score for current question
        recordUserProgress(true, currentQscore, currentAnswer, currentLevel);
        currentQinSet++;
        currentQid = questionSet[currentQinSet]._id;
        if (currentQinSet == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
        }
        $('#storyText').html(questionSet[currentQinSet].storText);
        $('#questionText').html(questionSet[currentQinSet].qText);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQinSet + 1));
        $('#prevButton').show();
        $('#nextButton').hide();
        $('#answerBox').val('');
        var increment = (($('div.progress').outerWidth() / 100) * 33);
        var currentWidth = $('#level-progress-bar').width();
        $('#level-progress-bar').css("width", currentWidth + increment);


        // reset score to 10pts for next question
        currentQscore = 10;

        // populate pts avaiable for this question
        $('#questionPts').text(currentQscore + ' pts');

        // initialise popovers on page
        $("[data-toggle=popover]").popover();

        // display total score data
        displayTotalScore(levelData.total_score);

    } else {
        $('.modal-footer button').on('click', function () {
            initLevel(currentLevel + 1);
        });
        $('#badgeModal .modal-footer button').html('Level ' + (currentLevel + 1));
        $('#badgeModal').modal('show');
        $('#level-progress-bar').css("width", $('div.progress').outerWidth());
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
        var $bar = $('.progress-bar');
        $bar.css("width", (($bar.width() % 133) - 33) + "%");
        $('#answerBox').val('');

        // reset score to 0pts for prev question because it has been completed
        currentQscore = 0;

        // initialise popovers on page
        $("[data-toggle=popover]").popover();

        // display total score data
        displayTotalScore(levelData.total_score);
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
    currentQscore = 10;
    if (questionSet != null) {
        $('#storyText').html(questionSet[0].storText);
        $('#questionText').html(questionSet[0].qText);
    }

    // display total score data
    displayTotalScore(levelData.total_score);

    // initialise popovers on page
    $("[data-toggle=popover]").popover();
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

    if (answer == q.correctRes0.regex) {
        writeFeedback(q.correctRes0.feedback, true);
        if (currentQinSet == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
        }
        $('#nextButton').show();
    } else {
        currentQscore = currentQscore - 2;

        // populate pts avaiable for this question
        $('#questionPts').text(currentQscore + ' pts');

        // TODO should this be storing score against user profile maybe instead of localStorage?
        recordQuestionScore(currentQscore);
        //localStorage.setItem(currentQid, getValidScore(currentQid, currentQscore));
        //console.log('INCORRECT - storing score = ' + getValidScore(currentQid, currentQscore));

        var feedback = q.incorrectRes0.feedback;
        if (q.misconceptions != null) {
            q.misconceptions.forEach(function (data) {
                if (answer == data.regex) {
                    feedback = data.feedback;
                }
            });
        }
        writeFeedback(feedback, false);
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

/*
 * clear answer box on focus and remove feedback panels
 */
$('#answerBox').focus(function () {
    $(this).val('');
    $('#msg-box').empty();
});

//function recordQuestionScore(Qscore) {
//    var validScore = getValidScore(currentQid, currentLevel, Qscore);
//    recordUserProgress(false, validScore, '', currentLevel, false);
//}

function recordUserProgress(completed, currentQscore, currentAnswer, currentLevel, isEndLevel) {

    var level = "level" + currentLevel.toString();
    var question = currentQid + "";

    // if player has not already completed level
    // player can only record data for their maxLevel
    if (currentLevel == levelData.progress.maxLevel) {
        console.log('inside first conditional');
        // if question is not marked as completed
        if (!levelData.progress[level][question].completed) {

            currentQscore = Math.min(currentQscore, minQscore);

            console.log('currentQscore before write is: ' + currentQscore);

            levelData.total_score += currentQscore;
            levelData.progress[level][question].completed = completed;
            levelData.progress[level][question].score = currentQscore;
            levelData.progress[level][question].answer = currentAnswer.toString();

            if (isEndLevel) {
                // user maxLevel is incremented
                levelData.progress.maxLevel = currentLevel + 1;
            }

            console.log('ATTEMPTING - recording for Qid ' + question + ': \n     total score: ' + levelData.total_score +
                '\n     completed: ' + levelData.progress[level][question].completed +
                '\n     score: ' + levelData.progress[level][question].score +
                '\n     answer: ' + levelData.progress[level][question].answer);

            // post AJAX to server
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


        }

        // else question is already marked as completed
        else {
            alert('Yo! Looks like you already recorded your score for this question.' + '\nPlay on you little minx...');
        }
    }
    return $.Deferred().resolve();
}