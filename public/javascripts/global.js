// AJAX ERROR HANDLER
$(function () {
    $(document).ajaxError(function (e, jqxhr, ajaxsettings, err) {
        // IF ERROR LAYER NOT CURRENTLY APPLIED TO BODY
        if (!$('#errorLayer').length) {
            $('body').append('<div id=\"errorLayer\"></div>');
            window.alert('Oh dear, there is a problem with sending messages to the server. ' +
                'No further game progress will be saved and the app may not work properly.\n\n' +
                'Please try reloading the page...');
        }
    })
})


function displayUserProgress(levelData) {
    // populate level progress bar
    var currentLevel = levelData.progress['maxLevel'];
    var totalScore = levelData.total_score;
    for (var i = 1; i < currentLevel; i++) {
        $('.bs-wizard-step:nth-child(' + i + ')').removeClass('disabled').addClass('complete');
        // grab all completed levels and give them a tick
        $('.panel-default\[value=' + i + '\]').children(".panel-heading").append('&nbsp;<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\"><\/span>').addClass('level-complete');

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

function rewardBadges(badgeArray, isEndLevel) {
    badgeArray = JSON.parse(badgeArray);
    var last = (badgeArray.length - 1);
    $.each(badgeArray, function (index, value) {
        currentBadges.push(value);
        if (index == last) {
            makeBadgeModal(value, badgeArray[0]);
        } else {
            makeBadgeModal(value, null);
        }
    })

    if (isEndLevel) {
        var nextId = badgeArray[badgeArray.length - 1] + 1;
        $.get('/modal.html', function (data) {
            $modal = $(data).appendTo('body');
            $modal.attr("id", ("badge" + nextId));
            $modal.find('.modal-body').append("<img src=\"/images/badges/lev" + (currentLevel) + ".png\" alt=\"badge icon\"/>");
            var href = '/levels/' + (currentLevel + 1);
            $modal.find('a.modal-link').attr({
                "href": href,
                "data-toggle": "",
                "data-dismiss": ""
            }).text("Go to level " + (currentLevel + 1));
            if (badgeArray.length === 0) {
                $modal.modal('show');
            }
        })

    }
}

function makeBadgeModal(badge, lastElem) {
    $.get('/modal.html', function (data) {
        var badgeId = badge;

        $modal = $(data).appendTo('body')
        $modal.attr("id", ("badge" + badgeId));
        $modal.find('.modal-body').append("<img src=\"/images/badges/" + badgeId + ".png\" alt=\"badge icon\"/>");

        var href = "#badge" + (badgeId + 1);
        $modal.find('a.modal-link').attr("href", href);

        // TODO remember that this only works for badge id = 1!
        if (lastElem != null) {
            $('#badge' + lastElem).modal('show');
        }
    });
}


