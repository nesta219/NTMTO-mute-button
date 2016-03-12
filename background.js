function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.indexOf('nevertellmetheodds') !== -1) {
		console.log('show ntmto extension in toolbar');
		chrome.pageAction.show(tabId);
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
