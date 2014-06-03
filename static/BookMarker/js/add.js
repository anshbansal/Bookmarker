;

var URL_AUTOCOMPLETE = "auto/";

$(function () {
    $("#bookmark-name").autocomplete({
        source: URL_AUTOCOMPLETE
    });
});