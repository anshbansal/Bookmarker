var cur_location = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var static_url = '/static/BookMarker';
var static_img_url = cur_location + static_url + '/img';

//Variables for URLs
var url_autocomplete = "auto/";
var url_open_page = "open/";

//Variables for selector strings
var category = ".category";

//Variables for selectors
var category_input = $("#category_inp");

//Variables for event names
var EV_ENTER_KEY = "enterKey";
var EV_ADD_CATEGORY = "addCategory";
var EV_CLICK = "click";


//Auxiliary functions
function value_in_selector(value_of, selector) {
    var result = false;
    $(selector).each(function () {
        if (value_of.val() == $.trim($(this).text())) {
            result =  true;
        }
    });
    return result;
}


//Autocomplete for category search box
$(function () {
    category_input.autocomplete({
        source: url_autocomplete
    });
});

//Bindings for keys to Search Box
category_input.keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger(EV_ENTER_KEY);
    }
});

//Action for Search box Enter press
category_input.bind(EV_ENTER_KEY, function () {
    if (value_in_selector(category_input, ".ui-menu-item") == false) {
        alert("Not a category");
    } else if (value_in_selector(category_input, category) == true) {
        alert("Category already added");
    } else {
        $(this).trigger(EV_ADD_CATEGORY);
    }
});

//Action for addition of category on page
category_input.bind(EV_ADD_CATEGORY, function () {
    var val = category_input.val();
    $("#category_list").append(
        '<div class="img-rounded category ' + val + '">' +
            '<img src="' + static_img_url + '/delete.png" class="delete-cat ' + val + '"  title="Remove category '
            + val + '"/> ' + val +
            ' </div>'
    );
    category_input.val("");
});

//Action for click on delete of categories
$(document).on(EV_CLICK, ".delete-cat", function () {
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item != 'delete-cat') {
            $(category + item).remove();
        }
    });
});

//Action for click on bookmarks
$(document).on(EV_CLICK, ".bookmark-class", function () {
    var classList = $(this).attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item != 'bookmark-class') {
            $.ajax({
                url: url_open_page,
                data: {'id': item}
            });
        }
    });
});