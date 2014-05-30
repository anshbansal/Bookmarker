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


def search(request):
    return render(request, 'BookMarker/search.html')


def category_autocomplete(request):
    q = request.GET.get('term', '')
    categories = Category.objects.filter(name__icontains=q)
    results = []
    for category in categories:
        category_json = {'value': category.name}
        results.append(category_json)
    data = json.dumps(results)
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