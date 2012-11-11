if (window.location.host.indexOf('netflix') != -1) {
  // send a message to add the extension's icon to the address bar
  chrome.extension.sendMessage('', ''); 
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    getRTId(message);
  });


function getMovieTitle(url) {
    // find position of '&t=' in url
    var title = url.substring(url.indexOf('&t=') + 3);
    title = decodeURIComponent(title);
    title = title.replace(/\+/g, " ");
    alert(title);
}

function getRTId(url) {
    // note that the title will be URI encoded, which
    // the RT API calls for anyway.
    var title = url.substring(url.indexOf('&t=') + 3);
    var requested_url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=';
    requested_url += title;
    requested_url += '&page_limit=10&page=1&apikey=de5ugjqstcbpqcsqmcnybuhz';
    get(requested_url, function(response) {
        var popup = window.open('', 'Trailer');
        popup.document.write(response);
    });
}

// from 'javascript: the definitive guide', pp.500-501
function get(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
        // if the request is complete and was successful
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf('xml') !== -1 && request.responseXML) {
                callback(request.responseXML); 
            } else if (type === 'application/json') {
                callback(JSON.parse(request.responseText));
            } else {
                callback(request.responseText);
            }
        }
    };
    request.send(null);    
}


