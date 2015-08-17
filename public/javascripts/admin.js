/**
 * Created by nic on 03/08/2015.
 */

var currentQuestionId = 0;

function displayQuestionUsageData() {
    $tableOverall = $('#overallData').find('tbody');
    $.getJSON('/admin/getQuestionUsageData', function (data) {
        data.forEach(function (entry) {
            $tableOverall.append('<tr class=\"row-link\"><td>' + entry._id + '</td><td>' + entry.correct + '</td><td>' + entry.incorrect + '</td></tr>');
        })
        $('#overallData').sort_table({
            "action": "init"
        });
    })

    $tableOverall.on('click', '.row-link', function (e) {
        e.preventDefault();
        if (currentQuestionId == 0) $('#correctToggle').bootstrapSwitch('toggleDisabled');
        var qId = $(this).find('>:first-child').text();
        var isCorrect = $("#correctToggle").is(':checked').toString();
        currentQuestionId = qId;
        displaySingleQuestionData(qId, isCorrect);
    })
}

function displaySingleQuestionData(qId, isCorrect) {
    $('div.singleTable').find('div.copy_sort_table').remove();
    $tableSingle = $('#singleQuestionData').find('tbody');
    $tableSingle.empty();
    $('h3.singleTable').text('Question ' + qId);
    var url = '/admin/getQuestionUsageData/' + isCorrect + '/' + qId;
    $.getJSON(url, function (data) {
        if (data.length > 0) {
            data.forEach(function (entry) {
                $tableSingle.append('<tr><td>\"' + entry._id + '\"</td><td>' + entry.timesSubmitted + '</td><td>' + entry.diffUsers + '</td></tr>');
            })
        } else {
            $tableSingle.append("Nothing to show");
        }

        $('#singleQuestionData').sort_table({
            "action": "init"
        });
    })
}
