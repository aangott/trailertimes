// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(msg, sender, sendResponse) { // the params are sent as part of the event that triggers the listener.

  // turn on the extension icon in the address bar
  chrome.pageAction.show(sender.tab.id);

  // ensure multiple menus are not created upon multiple calls of this function.
  chrome.contextMenus.removeAll();  
  // add the link to the context menu if the user clicks on a link including '&t='
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
