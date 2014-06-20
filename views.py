from django.db import transaction
from django.db.utils import DatabaseError
from django.http import HttpResponse
from django.shortcuts import render

from BookMarker.models import BookMark, Category

import json
import webbrowser


###########################
##       Auxiliary       ##
###########################
def _get_objects_by_params(request, param_name, object_class):
    ids_string = request.GET.get(param_name, '')
    if ids_string == '':
        return []
    ids = ids_string.split(',')
    return [object_class.objects.get(pk=_id) for _id in ids]


class Autocomplete():
    @staticmethod
    def _get_json(cur_objects, func):
        results = []
        for cur_object in cur_objects:
            results.append(func(cur_object))
        return json.dumps(results)

    @staticmethod
    def autocomplete(request, class_name, attr_name):
        term = request.GET.get('term', '')
        objects = class_name.objects.filter(**{
            attr_name + '__icontains': term
        })

        exclude_value = request.GET.get("excludes", "")
        if exclude_value != "":
            objects = objects.exclude(id__in=[int(i) for i in exclude_value.split(",")])

        data = Autocomplete._get_json(
            objects,
            lambda x: getattr(x, attr_name)
        )
        return HttpResponse(data, 'application/json')


class GetBookMarks:
    @staticmethod
    def get_bookmarks_by_categories(categories):
        bookmarks = set()
        for category in categories:
            bookmarks.update(category.bookmark_set.all())
        return bookmarks

    @staticmethod
    def get_bookmark_by_name(bookmark_name):
        return BookMark.objects.filter(name=bookmark_name)[0]


class GetCategories:
    @staticmethod
    def get_categories_by_bookmark(bookmark):
        return bookmark.category.all()

    @staticmethod
    def get_category_by_name(category_name):
        return Category.objects.filter(name=category_name)


###########################
##         Services      ##
###########################
def category_autocomplete(request):
    return Autocomplete.autocomplete(request, Category, 'name')


def bookmark_autocomplete(request):
    return Autocomplete.autocomplete(request, BookMark, 'name')


def website_open(request):
    cur_url = _get_objects_by_params(request, 'id', BookMark)[0].url_content
    webbrowser.open(cur_url)
    return HttpResponse('success', 'text/html')


def get_bookmarks(request):
    categories = _get_objects_by_params(request, 'value', Category)
    bookmarks = GetBookMarks.get_bookmarks_by_categories(categories)
    return render(request, 'BookMarker/partials/bookmarks.html', {
        'bookmarks': bookmarks,
    })


#TODO Need to check the name
def get_bookmark_by_name(request):
    bookmark = GetBookMarks.get_bookmark_by_name(request.GET.get("name", ""))
    categories = GetCategories.get_categories_by_bookmark(bookmark)
    result = [category.name for category in categories]
    return HttpResponse(json.dumps(result), 'application/json')


def get_category(request):
    category = Category.objects.get(name=request.GET.get('value', ''))
    return render(request, 'BookMarker/partials/category.html', {
        'category': category,
    })


@transaction.atomic
def add_category(request):
    name = request.GET.get("value", "")
    if name.isspace() or not name:
        message = 'Category cannot be empty'
    else:
        if len(GetCategories.get_category_by_name(name)) == 0:
            try:
                with transaction.atomic():
                    cat = Category(name=name)
                    cat.save()
                message = 'Category ' + name + ' added to App'
            except DatabaseError:
                message = 'Problem in saving category'
        else:
            message = 'Category ' + name + ' already present'
    return HttpResponse(message, 'text/html')


#TODO Make changes here
def delete_category(request):
    category = _get_objects_by_params(request, 'value', Category)
    bookmarks = GetBookMarks.get_bookmarks_by_categories(category[0].id)
    for bookmark in bookmarks:
        print(bookmark.name)
    return HttpResponse('Testing', 'text/html')


########################
##        Views       ##
########################
def search(request):
    return render(request, 'BookMarker/bookmarker.html')