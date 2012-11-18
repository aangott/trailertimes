if (window.location.host.indexOf('netflix') != -1) {
  // send a message to add the extension's icon to the address bar
  chrome.extension.sendMessage('', ''); 
}


// when this extension's item in the context menu is 
// clicked, background.js sends a message to this script
// indicating the URL of the item that was right-clicked.
chrome.extension.onMessage.addListener(function(url, sender, sendResponse) {
    getRTInfo(url);
  });


function getRTInfo(url) {
    // note that the title will be URI encoded, which
    // the RT API calls for anyway.
    var title = url.substring(url.indexOf('&t=') + 3);
    var requested_url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=';
    requested_url += title;
    requested_url += '&page_limit=10&page=1&apikey=de5ugjqstcbpqcsqmcnybuhz';
    get(requested_url, function(response) {
        // response is returned as text for some reason,
        // even though it's JSON. parsing JSON here.
        getRTId(title, JSON.parse(response));
    });
}


function getRTId(title, response) {
    // need to URI decode title so it is comparable to the results
    // returned by RT.
    var decodedTitle = decodeURI(title).replace(/\+/g, " ");
    for (var i = 0; i < response.movies.length; i++) {
        if (response.movies[i].title == decodedTitle) {
            var RTId = response.movies[i].id;
            break;
        }
    }
    getTrailerUrl(RTId);
}


function getTrailerUrl (RTId) {
    var requested_url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/';
    requested_url += RTId;
    requested_url += '/clips.json?apikey=de5ugjqstcbpqcsqmcnybuhz';
    get(requested_url, function(response) {
        response = JSON.parse(response);
        var trailerUrl = response.links.alternate;
        window.open(trailerUrl, '_blank');
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
