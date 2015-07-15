function awardBadge(badgeId) {
    //TODO generic badge modal display for anywhere in quiz
}

function displayUserProgress(levelData) {
    var currentLevel = levelData.progress['currentLevel'];

    for (var i = 1; i < currentLevel; i++) {
        $('.bs-wizard-step:nth-child(' + i + ')').removeClass('disabled').addClass('complete');
    }

    $('.bs-wizard-step:nth-child(' + currentLevel + ')').removeClass('disabled').addClass('active');
}
