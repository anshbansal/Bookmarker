from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic

from BookMarker.models import BookMark, Category


import json


class DetailView(generic.DetailView):
    model = BookMark
    template_name = 'BookMarker/detail.html'


def get_category(request):
    return render(request, 'BookMarker/search.html', {
        'categories': Category.objects.all(),
        'bookmarks': BookMark.objects.all(),
    })


def category_autocomplete(request):
    q = request.GET.get('term', '')
    categories = Category.objects.filter(name__icontains = q )
    results = []
    for category in categories:
        category_json = {}
        category_json['id'] = category.rxcui
        category_json['label'] = category.short_name
        category_json['value'] = category.short_name
        results.append(category_json)
    data = json.dumps(results)
    return HttpResponse(data, 'application/json')