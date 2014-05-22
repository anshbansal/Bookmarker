/**
 * Created by Aseem on 5/22/14.
 */

$(function () {
    $("#category_inp").autocomplete({
        source: "auto/"
    });
});

$("#category_inp").bind("enterKey", function (e) {
    alert("Aseem")
});

//Add Bindings for keys
$("#category_inp").keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});