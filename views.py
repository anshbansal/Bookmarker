from django.http import HttpResponse
from django.shortcuts import render

from BookMarker.models import BookMark, Category

import json
import webbrowser


def _get_objects_by_ids(request, object_class):
    ids_string = request.GET.get('ids', '')
    if ids_string == '':
        return []
    ids = ids_string.split(',')
    return [object_class.objects.get(pk=_id) for _id in ids]


def _get_json_autocomplete(cur_objects, func):
    results = []
    for cur_object in cur_objects:
        results.append(func(cur_object))
    return json.dumps(results)


def category_autocomplete(request):
    term = request.GET.get('term', '')
    data = _get_json_autocomplete(
        Category.objects.filter(name__icontains=term),
        lambda x: x.name
    )
    return HttpResponse(data, 'application/json')


def website_open(request):
    q = request.GET.get('id', '')
    webbrowser.open(BookMark.objects.get(pk=int(q)).url_content)
    return HttpResponse('', 'text/html')


def get_bookmarks(request):
    categories = _get_objects_by_ids(request, Category)
    bookmarks = set()
    for category in categories:
        bookmarks.update(category.bookmark_set.all())
    return render(request, 'BookMarker/partials/bookmarks.html', {
        'bookmarks': bookmarks,
    })


def get_category(request):
    category = Category.objects.get(name=request.GET.get('value', ''))
    return render(request, 'BookMarker/partials/category.html', {
        'category': category,
    })


#Functions for Views
def search(request):
    return render(request, 'BookMarker/search.html')


def add(request):
    return render(request, 'BookMarker/add.html')