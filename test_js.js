(function(path, params, method) {
    /*
    Took help from -
    http://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit

    Need to look at -
    http://www.smashingmagazine.com/2010/05/23/make-your-own-bookmarklets-with-jquery/
     */
    alert('Test 1');
	method = method || "post"; 

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
	alert('Test 2')
})("http://127.0.0.1:8000/polls/1/vote/", {choice: '1', csrfmiddlewaretoken: 'mSE7on6D7XSj1rWZhW70Gw3g8D39WBpG'});