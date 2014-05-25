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


category_input.keyup(function (e) {
    //Add Bindings for keys to Search Box
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});


category_input.bind("enterKey", function (e) {
    //For Search Box Enter Key
    var is_category = false;
    $(".ui-menu-item").each(function (index) {
            if (category_input.val() == $.trim($(this).text())) {
                is_category = true;
                return false;
            }
        }
    )
    if (is_category == false) {
        alert("Not a category");
        return false;
    }

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
            '<li class="category ' + category_input.val() + '">' +
                ' <img src="' + static_img_url + '/delete.png" class="delete-cat ' + category_input.val() + '" ' +
                ' title="Remove category ' + category_input.val() + '"/>' +
                category_input.val() +
                '</li>'
        );
    }
    category_input.val("");
});


$(document).on('click', ".delete-cat", function (e) {
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item != 'delete-cat') {
            $('.category.' + item).remove();
        }
    });
})


$(document).on('click', ".bookmark-class", function () {
    //For opening the bookmarks via the server
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item != 'bookmark-class') {
            $.ajax({
                url: "open/",
                data: {'id': item}
            });
        }
    });
});