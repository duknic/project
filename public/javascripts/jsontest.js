/**
 * Created by nic on 02/07/2015.
 */
var questions = [
    {
        "question": "quesiton 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        "answer": "answer1",
        "a1": "answer 1",
        "a2": "answer 2",
        "a3": "answer 3",
        "a4": "answer 4"
    },
    {
        "question": "quesiton 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        "answer": "answer2",
        "a1": "answer 1a",
        "a2": "answer 2",
        "a3": "answer 3",
        "a4": "answer 4"
    },
    {
        "question": "quesiton 3 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        "answer": "answer3",
        "a1": "answer 1b",
        "a2": "answer 2",
        "a3": "answer 3",
        "a4": "answer 4"
    },
    {
        "question": "quesiton 4 - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?",
        "answer": "answer4",
        "a1": "answer 1c",
        "a2": "answer 2",
        "a4": "answer 3",
        "a4": "answer 4"
    }
];

var currentQuestion = 0;
var currentAnswer = "";

function nextQuestion() {


    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        $('#question').html(questions[currentQuestion].question);
        $('#answer1').html(questions[currentQuestion].a1);
        $('#answer2').html(questions[currentQuestion].a2);
        $('#answer3').html(questions[currentQuestion].a3);
        $('#answer4').html(questions[currentQuestion].a4);
        currentAnswer = questions[currentQuestion].answer;
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQuestion + 1));
        $('#prev').show();
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
        $('#answer1').html(questions[currentQuestion].a1);
        $('#answer2').html(questions[currentQuestion].a2);
        $('#answer3').html(questions[currentQuestion].a3);
        $('#answer4').html(questions[currentQuestion].a4);
        currentAnswer = questions[currentQuestion].answer;
        $("#msg-box").empty();
        $('#questionNum').html("Question " + (currentQuestion + 1));
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
        $('#answer1').html(questions[0].a1);
        $('#answer2').html(questions[0].a2);
        $('#answer3').html(questions[0].a3);
        $('#answer4').html(questions[0].a4);
        currentAnswer = questions[0].answer;
    }

    $('#prev').hide();
}

function checkAnswer(answer) {
    ;
    var out = "";
    if (answer == currentAnswer) {
        out = "<div class=\"alert alert-success\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\">&nbsp; CORRECT<\/span><\/div>";

    }
    else {
        out = "<div class=\"alert alert-danger\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">&nbsp; WRONG<\/span><\/div>";
    }

    $("#msg-box").html(out);
}
