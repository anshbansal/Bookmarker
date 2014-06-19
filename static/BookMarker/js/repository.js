function _BaseRepo() {
}

_BaseRepo.GeneralAjaxCall = function (urlName, dataDic) {
    return $.ajax({
        url: urlName,
        data: dataDic
    });
};

_BaseRepo.AjaxCall = function (urlName, valueData) {
    return _BaseRepo.GeneralAjaxCall(urlName, {value: valueData});
};


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
    return _BaseRepo.AjaxCall("category/", categoryName);
};

CategoryRepo.AddCategory = function (categoryName) {
    return _BaseRepo.AjaxCall("service/category/add", categoryName);
};


function BookmarkRepo() {
}

BookmarkRepo.ListByCategory = function (categoryIds) {
    return _BaseRepo.GeneralAjaxCall("bookmark/category/", {ids: categoryIds});
};

BookmarkRepo.OpenPage = function (sel) {
    return _BaseRepo.GeneralAjaxCall("open/", {id: getClassNames(sel, "col-md-12 bookmark ".length)});
};