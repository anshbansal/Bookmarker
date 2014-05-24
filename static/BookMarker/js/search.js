/**
 * Created by Aseem on 5/22/14.
 */

var cur_location = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var static_url = '/static/BookMarker';
var static_img_url = cur_location + static_url + '/img';

var category_input = $("#category_inp");

$(function () {
    category_input.autocomplete({
        source: "auto/"
    });
});

//Add Bindings for keys
category_input.keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

category_input.bind("enterKey", function (e) {
    var already_present = false;
    $(".category").each(function (index) {
            if (category_input.val() == $.trim($(this).text())) {
                alert("Category already added");
                already_present = true;
                return false;
            }
        }
    )
    if (already_present == false) {
        $("#category_list").append(
            '<span class="category ' + category_input.val() + '">' +
                category_input.val() +
                ' <img src="' + static_img_url + '/delete.png" class="delete-cat ' + category_input.val() + '" ' +
                ' title="Remove category ' + category_input.val() + '"/>' +
                '</span>'
        );
    }
});

$(document).on('click', ".delete-cat", function (e) {
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item != 'delete-cat') {
            $('.category.' + item).remove();
        }
    });
})