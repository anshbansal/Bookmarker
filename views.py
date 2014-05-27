from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic

from BookMarker.models import BookMark, Category

import json
import webbrowser


def get_category(request):
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
    category_string = request.GET.get('categories', '')
    category_list = [] if category_string == '' else category_string.split(',')
    bookmarks = set()
    for i in category_list:
        bookmarks.update(Category.objects.get(name=i).bookmark_set.all())
    return render(request, 'BookMarker/partials/bookmarks.html', {
        'bookmarks': bookmarks,
    })