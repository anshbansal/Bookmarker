from django.http import HttpResponse
from django.shortcuts import render
from django.views import generic

from BookMarker.models import BookMark, Category


import json
import webbrowser


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
        category_json = {'value': category.name}
        results.append(category_json)
    data = json.dumps(results)
    return HttpResponse(data, 'application/json')


def website_open(request):
    q = request.GET.get('id', '')
    webbrowser.open(BookMark.objects.get(pk=int(q)).url_content)
    return HttpResponse('', 'text/html')