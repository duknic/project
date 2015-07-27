function awardBadge(badgeId) {
    //TODO generic badge modal display for anywhere in quiz
}

function displayUserProgress(levelData) {
    // populate level progress bar
    var currentLevel = levelData.progress['maxLevel'];
    var totalScore = levelData.total_score;
    for (var i = 1; i < currentLevel; i++) {
        $('.bs-wizard-step:nth-child(' + i + ')').removeClass('disabled').addClass('complete');
        // grab all completed levels and give them a tick
        $('.btn-level-choose\[value=' + i + '\]').html('<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>' + '<br/>Level ' + i).addClass('level-complete');

    }
    $('.bs-wizard-step:nth-child(' + currentLevel + ')').removeClass('disabled').addClass('active');
    displayTotalScore(totalScore);
}

function displayTotalScore(totalScore) {
    // populate total score
    $({countNum: $('#totalScore').text()}).animate({countNum: totalScore}, {
        duration: 2000,
        easing: 'linear',
        step: function () {
            $('#totalScore').text(Math.ceil(this.countNum));
        },
        complete: function () {
            $('#counter').text(this.countNum);
        }
    });
}

//CHECK IF BROWSER SUPPORTS LOCAL STORAGE
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function getValidScore(questionId, levelNum, questionScore, callback) {
    var level = "level" + levelNum.toString();
    var question = questionId + "";

    $.getJSON('/customData', function (data) {
        var recordedScore = data.progress[level][question].score;
        var score = recordedScore ? Math.min(recordedScore, questionScore) : questionScore;
        if (typeof callback == 'function') {
            if (score > 0) {
                callback(score);
            } else {
                callback(0);
            }
        }
    });
}


function awardBadge(badgeId) {
    $.get('/modal.html', function (data) {
        $(data).appendTo('body');
        $('#badgeModal').modal('show')
    });
}


