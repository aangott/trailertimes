if (window.location.host.indexOf('netflix') != -1) {
  // send a message to add the extension's icon to the address bar
  chrome.extension.sendMessage('', ''); 
}

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    getMovieTitle(message);
  });


function getMovieTitle(url) {
    // find position of '&t=' in url
    var title = url.substring(url.indexOf('&t=') + 3);
    title = decodeURIComponent(title);
    title = title.replace(/\+/g, " ");
    alert(title);


}



