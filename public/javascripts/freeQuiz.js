/**
 * Created by nic on 02/07/2015.
 */

var questionSet = [];
var currentQ = 0;
var currentQscore = 0;

function nextLevel() {

}

function nextQuestion() {

    if (currentQ < questionSet.length - 1) {
        currentQ++;
        if (currentQ == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
        }
        $('#storyText').html(questionSet[currentQ].storText);
        $('#questionText').html(questionSet[currentQ].qText);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQ + 1));
        $('#prevButton').show();
        $('#nextButton').hide();
        $('#answerBox').val('');
        var $bar = $('.progress-bar');
        $bar.css("width", ($bar.width() + 33) + "%");
    } else {
        $('#badgeModal').modal('show');
        $('.modal-footer button').on('click', nextLevel());

    }

}

function prevQuestion() {

    if (currentQ > 0) {
        $('#nextButton').show();
        currentQ--;
        $('#storyText').html(questionSet[currentQ].storText);
        $('#questionText').html(questionSet[currentQ].qText);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQ + 1));
        if (currentQ == 0) {
            $('#prevButton').hide();
        }
        var $bar = $('.progress-bar');
        $bar.css("width", (($bar.width() % 133) - 33) + "%");
        $('#answerBox').val('');
    }
    else {
        alert("no more questions");
        $("#msg-box").empty();
    }
}

function initQuiz(questions) {

    questionSet = questions;
    if (questionSet != null) {
        $('#storyText').html(questionSet[0].storText);
        $('#questionText').html(questionSet[0].qText);
    }

    //$('#prev').hide();
}

/*
 * Check Answer:
 * takes regex string from free text answerBox and checks it against correct and incorrect
 * possibilities from the current question in the questionSet
 */
function checkAnswer(answer) {

    var q = questionSet[currentQ];

    if (answer == q.correctRes0.regex) {
        writeFeedback(q.correctRes0.feedback, true);
        if (currentQ == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
        }
        $('#nextButton').show();
    }
    else if (q.correctRes1 != null && answer == q.correctRes1.regex) {
        // TODO evaluate user's regex to find if it is correct then give 'not ideal' feedback
        writeFeedback(q.correctRes1.feedback, true);
        if (currentQ == questionSet.length - 1) {
            $('#nextButton').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>\&nbsp;\&nbsp;Finish');
        }
        $('#nextButton').show();
    } else {
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

function recordUserProgress() {

}