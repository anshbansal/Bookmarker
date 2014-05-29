//Variables for URLs
var url_autocomplete = "auto/";
var url_open_page = "open/";
var url_bookmark_refresh = "bookmarks/";
var url_category = "category/";

//Variables for selector strings
var category = ".category";

//Variables for selectors
var category_input = $("#category_inp");
var bookmarks_list = $("#bookmarks");

//Variables for event names
var EV_ENTER_KEY = "enterKey";
var EV_ADD_CATEGORY = "addCategory";
var EV_CLICK = "click";
var EV_UPDATE_BOOKMARKS = "updateBooks";


//Auxiliary functions
function value_in_selector(value_of, selector) {
    var result = false;
    $(selector).each(function () {
        if (value_of.val() == $.trim($(this).text())) {
            result = true;
        }
    });
    return result;
}

function get_all_categories() {
    var classes = [];
    $(category).each(function () {
        classes.push($.trim($(this).text()));
    });
    return classes.join(",");
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
        category_input.val("");
    } else {
        $(this).trigger(EV_ADD_CATEGORY);
    }
});

//Action for addition of category on page
category_input.bind(EV_ADD_CATEGORY, function () {
    $.ajax({
        url: url_category,
        data: {'value': category_input.val()},
        success: function (output) {
            $("#category_list").append(output);
            category_input.val("");
            bookmarks_list.trigger(EV_UPDATE_BOOKMARKS);
        }
    });
});

//Action for click on delete of categories
$(document).on(EV_CLICK, ".delete-cat", function () {
    var length_string = "delete-cat ".length;
    $(category + "." + $(this).attr('class').substr(length_string)).remove();
    bookmarks_list.trigger(EV_UPDATE_BOOKMARKS);
});

//Action for updating bookmarks
bookmarks_list.bind(EV_UPDATE_BOOKMARKS, function () {
    $.ajax({
        url: url_bookmark_refresh,
        data: {'categories': get_all_categories()},
        success: function (output) {
            $('#bookmarks').html(output);
        }
    });
});

//Action for click on bookmarks
$(document).on(EV_CLICK, ".bookmark-class", function () {
    $.ajax({
        url: url_open_page,
        data: {'id': $(this).attr('class').substr(25)}
    });
});