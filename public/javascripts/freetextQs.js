/**
 * Created by nic on 02/07/2015.
 */
var questions = [
    {
        "question": "<p>Write regular expression, as concise as possible, to match the following String exactly</p><p><strong>dogfoot</strong></p>",
        "testStr": "dogfoot",
        "feedbackPos": "Well done! A good model answer might be [a-z]{7}",
        "feedbackNeg": ""
    },
    {
        "question": "<p>Write regular expression, as concise as possible, to match the following String</p><p><strong>mega:caterpillar</strong></p>",
        "testStr": "mega:caterpillar",
        "feedbackPos": "Well done! A good model answer might be a*zahi*j*",
        "feedbackNeg": ""
    },
    {
        "question": "<p>Write regular expression, as concise as possible, to match the following String</p><p><strong>..X8991</strong></p>",
        "testStr": "..X8991",
        "feedbackPos": "Well done! A good model answer might be a*zahi*j*",
        "feedbackNeg": ""
    },
    {
        "question": "<p>Write regular expression, as concise as possible, to match the following String</p><p><strong>transformerzzzzzzz</strong></p>",
        "testStr": "transformerzzzzzzz",
        "feedbackPos": "Well done! A good model answer might be a*zahi*j*",
        "feedbackNeg": ""
    }
];

var currentQuestion = 0;
var currentString = "";


function nextQuestion() {


    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        $('#question').html(questions[currentQuestion].question);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQuestion + 1));
        $('#prev').show();
        $('#answerBox').val("");
    }
    else {
        alert("ran out of questions");
        $("#msg-box").empty();
    }
}

function prevQuestion() {


    if (currentQuestion > 0) {
        currentQuestion--;
        $('#question').html(questions[currentQuestion].question);
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQuestion + 1));
        $('#answerBox').val("");
        if (currentQuestion == 0) {
            $('#prev').hide();
        }
    }

    else {
        alert("no more questions");
        $("#msg-box").empty();
    }
}

function initQuiz() {
    if (questions != null) {
        $('#question').html(questions[0].question);
        currentString = questions[0].testStr;
    }

    $('#prev').hide();
}

function checkAnswer() {

    var out = "";
    var userAnswer = $('#answerBox').val();
    var regex = new RegExp(userAnswer + "\\b");
    var isCorrect = regex.test(currentString);

    if (isCorrect && userAnswer.length > 0) {
        out = "<div class=\"panel panel-success\">\r\n  <div class=\"panel-heading \">" +
            "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\">&nbsp; CORRECT<\/span>" +
            "<\/div>\r\n  <div class=\"panel-body\">" + questions[currentQuestion].feedbackPos; + "<\/div>\r\n<\/div>";

    }
    else {
        out = "<div class=\"alert alert-danger\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">&nbsp; WRONG<\/span><\/div>";
    }

    $("#msg-box").html(out);
}
/**
 * Created by nic on 03/07/2015.
 */
