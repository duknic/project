// get Level question JSON
function getLevel(level) {
    //jQuery AJAX call for JSON
    $.getJSON('/levels/' + level, function (data) {
        return data;
    });
};


//function createModal(title, body, button) {
//    return '<div class=\"modal fade\" id=\"#dynoModal\">' +
//        '<div class=\"modal-dialog modal-sm\"> ' +
//        '<div class=\"modal-content\">' +
//        '<div class=\"modal-header\">' +
//        '<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">' +
//        '<span aria-hidden=\"true\">&times;<\/span>' +
//        '</button>' +
//        '<h4 class=\"modal-title\" id=\"#modTitle\">' + title + '</h4>' +
//        '</div>' +
//        '<div class=\"modal-body\" id=\"#modBody\"><p>' + body + '</p><\/div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-primary\" id=\"#modButton\">' + button + '</button><\/div><\/div><\/div><\/div>'
//}
