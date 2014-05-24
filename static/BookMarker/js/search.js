/**
 * Created by Aseem on 5/22/14.
 */

$(function () {
    $("#category_inp").autocomplete({
        source: "auto/"
    });
});

var category_input = $("#category_inp");

//Add Bindings for keys
category_input.keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});

category_input.bind("enterKey", function (e) {
    var already_present = false;
    $(".category").each(function (index) {
            if (category_input.val() == $(this).text()) {
                alert("Category already added");
                already_present = true;
                return false;
            }
        }
    )
    if (already_present == false) {
        $("#category_list").append(
            '<div class="category '+ category_input.val() +'">' + category_input.val() +
                '< class="delete-cat '+ category_input.val() +'">Del</div></div>'
        );
    }
});