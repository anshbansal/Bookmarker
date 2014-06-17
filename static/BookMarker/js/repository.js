function CategoryRepo() {
}

CategoryRepo.AutoByLike = function (exclude, term, res) {
    return $.getJSON(
        "auto/category/",
        {excludes: exclude, term: term},
        res
    );
};

CategoryRepo.DetailByName = function (categoryName) {
    return $.ajax({
        url: "category/",
        data: {'value': categoryName}
    })
};


function BookmarkRepo() {
}

BookmarkRepo.ListByCategory = function (categoryIds) {
    return $.ajax({
        url: "bookmark/category/",
        data: {'ids': categoryIds}
    });
};

BookmarkRepo.OpenPage = function (sel) {
    return $.ajax({
        url: "open/",
        data: {'id': getClassNames(sel, "col-md-12 bookmark ".length)}
    });
};