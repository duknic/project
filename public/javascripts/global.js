function awardBadge(badgeId) {
    //TODO generic badge modal display for anywhere in quiz
}

function displayUserProgress(levelData) {
    // populate level progress bar
    var currentLevel = levelData.progress['maxLevel'];
    for (var i = 1; i < currentLevel; i++) {
        $('.bs-wizard-step:nth-child(' + i + ')').removeClass('disabled').addClass('complete');
    }
    $('.bs-wizard-step:nth-child(' + currentLevel + ')').removeClass('disabled').addClass('active');

    displayTotalScore(totalScore);
}

function displayTotalScore(totalScore) {
    // populate total score
    $({countNum: $('#totalScore').text()}).animate({countNum: totalScore + 1}, {
        duration: (totalScore / 10) * 1000,
        easing: 'linear',
        step: function () {
            $('#totalScore').text(Math.floor(this.countNum));
        },
        complete: function () {
            $('#counter').text(this.countNum);
        }
    });
}

//function getTotalScore() {
//    $.getJSON('http://localhost:3000/getCustomData', function (data) {
//        return data.total_score;
//    });
//}

//CHECK IF BROWSER SUPPORTS LOCAL STORAGE
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}


function getValidScore(questionID, levelNum, questionScore) {
    var url = 'http://localhost:3000/customData/progress/level' + levelNum + '/' + questionID + '/score';
    $.getJSON(url, function (recordedScore) {
        var returnedScore = recordedScore ? Math.min(recordedScore, questionScore) : questionScore;
        console.log('getValidScore returning: ' + returnedScore);
        return $.Deferred().resolve(returnedScore);
    });
}

//function getValidScore(questionID, questionScore) {
//    // TODO need to store this against user profile not local storage
//    var recordedScore = localStorage.getItem(questionID);
//    console.log('recordedscore = ' + recordedScore);
//    return recordedScore ? Math.min(recordedScore, questionScore) : questionScore;
//}