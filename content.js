console.log('start content.js');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('listening for run_block_function');

    if( request.message === "run_block_function" ) {
		console.log('run_block_function found');
    	hideMessages();

    }

});

function hideMessages() {
	console.log('hide messages start');
	chrome.storage.local.get('userList', function(storageObj) {
		console.log('storage accessed');
		console.log(storageObj.userList);
		//to search for user names
		//jQuery(jQuery('.tr2thread')[0]).find('strong')

		var userList = storageObj.userList;

		var $postHeaderList = jQuery('.tr2thread');

		for(var i = 0; i < $postHeaderList.length; i++) {

			var $postHeader = jQuery($postHeaderList[i]);
			var postHeaderName = $postHeader.find('strong').text();

			var $showHideButton = jQuery('<span class="showHideButton">[expand]</span>')

			if(_.indexOf(userList, postHeaderName) !== -1) {
				//we have a match
				console.log('post header name found: ' + postHeaderName);

				var $postContent = $postHeader.parents('tr').next('tr').find('td.tr1');

				$postContent.css('display', 'none');

			}
			else {
				$postHeader.parents('tr').next('tr').find('td.tr1').css('display', 'table-cell');

				$showHideButton.text('[hide]');
			}

			$showHideButton.on('click', function(){
				var $me = jQuery(this);

				var $myPost = $me.parents('tr').next('tr').find('td.tr1')

				if($myPost.css('display') === 'none') {
					$me.text('[hide]');
					$myPost.css('display', 'table-cell');
				}
				else {
					$myPost.css('display', 'none');
					$me.text('[expand]');
				}
			});

			//remove old one
			$postHeader.find('.showHideButton').remove();
			//add new one
			$postHeader.append($showHideButton);



		}

	});
	console.log('hide messages end');

}

jQuery(document).ready(function(){
	console.log('doc ready');
	hideMessages();
});

