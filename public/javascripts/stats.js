/**
 * Created by nic on 01/08/2015.
 */
function displayBadges() {
    $.getJSON('/customData/badges', function (badges) {
        $.getJSON('/customData/progress/maxLevel', function (maxLevel) {
            //console.log('badges = ' + badges + '\nmaxLevel = ' + maxLevel);
            for (var badge in badges) {
                $('#badgeContainer').append("<img src=\"/images/badges/" + badges[badge] + ".png\" alt=\"badge icon\"/>");
            }
            for (var i = 1; i < maxLevel; i++) {
                $('#badgeContainer').append("<img src=\"/images/badges/lev" + i + ".png\" alt=\"badge icon\"/>");
            }
            if (badges.length == 0 && maxLevel == 1) {
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
            '<td>' + player.badges.length + '</td> <td>' + player.createdAt + '</td></tr>'
        );
    });

    $leaderboard.sort_table({
        "action": "init"
    });
}
