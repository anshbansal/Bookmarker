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