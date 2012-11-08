/**************************main*******************************/
if (window.location.host.indexOf('netflix') != -1) {
  // send a message to add the extension's icon to the address bar
  chrome.extension.sendMessage('', ''); 
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    alert('message received: ' + request);
  });
