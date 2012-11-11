
// Called when a message is passed. the params listed are sent 
// as part of the event that triggers the listener.
function onRequest(msg, sender, sendResponse) { 
    // turn on the extension icon in the address bar
    chrome.pageAction.show(sender.tab.id);

    // this ensures that multiple menus are not created 
    // upon multiple calls of this function.
    chrome.contextMenus.removeAll();  
    // add the link to the context menu if the user 
    // clicks on a link including '&t=' (i.e., a movie cover)
    chrome.contextMenus.create({'title': 'Try to get trailer', 
                                'contexts': ['link'],
                                'targetUrlPatterns': ['*://*/*&t=*'],
                                'onclick': sendURL});
    // Return nothing to let the connection be cleaned up.
    sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onMessage.addListener(onRequest);

function sendURL(info, tab) {
  chrome.tabs.sendMessage(tab.id, info.linkUrl);
}
