/**
 * Created by nic on 01/08/2015.
 */
function displayBadges() {
    $.getJSON('/customData/badges', function (badges) {
        //$.getJSON('/customData/progress/maxLevel', function (maxLevel) {
        $.getJSON('/customData/progress/compLevels', function (compLevels) {
            //console.log('badges = ' + badges + '\nmaxLevel = ' + maxLevel);
            for (var badge in badges) {
                $('#badgeContainer').append("<img src=\"/images/badges/" + badges[badge] + ".png\" alt=\"badge icon\"/>");
            }
            //for (var i = 1; i < maxLevel; i++) {
            for (var i = 0; i < compLevels.length; i++) {
                $('#badgeContainer').append("<img src=\"/images/badges/lev" + compLevels[i] + ".png\" alt=\"badge icon\"/>");
            }
            //if (badges.length == 0 && maxLevel == 1) {
            if (badges.length == 0 && compLevels.length == 0) {
                $('#badgeContainer').append("<br/>...it doesn't look like you have earned any badges yet!");
            }
        });
    });
}

function displayLeaderboard() {
    $leaderboard = $('table.leaderboard');
    $tbody = $leaderboard.find('tbody');
    leaderboardData.players.forEach(function (player) {
        $tbody.append(
            '<tr><td>' + player.fullname + '</td> <td>' + player.total_score + '</td>' +
            //'<td>' + (player.badges.length + (player.maxLevel - 1)) + '</td><td>' + player.progenAnswered + '</td><td>' + player.createdAt + '</td></tr>'
            '<td>' + (player.badges.length + player.compLevels.length) + '</td><td>' + player.progenAnswered + '</td><td>' + player.createdAt + '</td></tr>'
        );
    });

    $leaderboard.sort_table({
        "action": "init"
    });
}
