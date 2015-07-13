function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('nevertellmetheodds') !== -1) {
		chrome.pageAction.show(tabId);
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
