var userList;

var $ignoredUserUL;
var $addButton;
var $userNameField;

jQuery(document).ready(function() {
	//cache jquery refs
	$ignoredUserUL = jQuery('.ignoredUsers');
	$addButton = jQuery('.addToListButton');
	$userNameField = jQuery('.userNameField');

	function displayBlockedUsers(aUserList) {

		$ignoredUserUL.empty();

		for(var i = 0; i < aUserList.length; i++) {

			var $ignoredUserLI = jQuery('<li></li>');

			var $ignoredUserName = jQuery('<span class="blocked_user_name" data-user="'+aUserList[i]+'">' + aUserList[i] + '</span>');

			var $removeButton = jQuery('<span class="remove_blocked_user" data-user="'+aUserList[i]+'">[&#215]</span>');

			$ignoredUserLI.append($removeButton);
			$ignoredUserLI.append($ignoredUserName);

			$ignoredUserUL.append($ignoredUserLI);

			$removeButton.on('click', function(){
				unblockUser(jQuery(this).attr('data-user'));
			});

		}

	}

	function unblockUser(userNameToRemove) {
		chrome.storage.local.get('userList', function(storageObj) {

			userList = storageObj.userList;

			userList = _.without(userList, userNameToRemove);

			chrome.storage.local.set({userList : userList}, function() {
    			
	    		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				    var activeTab = tabs[0];
				    
				    displayBlockedUsers(userList);

	    			chrome.tabs.sendMessage(activeTab.id, {"message": "run_block_function"});
				    
				 });
	    		
	    	});

		});
	}

	$addButton.click(function(){
		
		blockUserFromInputField();

	});

	$userNameField.on('keypress', function(event) {

		if(event.keyCode === 13) {
			blockUserFromInputField();
		}

	});

	function blockUserFromInputField() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    var activeTab = tabs[0];
		    console.log('sendMessage');

	    	var newUserToBlock = $userNameField.val();

	    	var foundDuplicate = false;

	    	for(var i = 0; i < userList.length; i++) {
	    		if(userList[i] === newUserToBlock) {
	    			foundDuplicate = true;
	    			break;
	    		}
	    	}

	    	if(!foundDuplicate) {
	    		userList.push(newUserToBlock);
	    	}

	    	chrome.storage.local.set({userList : userList}, function() {
    			$userNameField.val('');
    			displayBlockedUsers(userList);

	    		chrome.tabs.sendMessage(activeTab.id, {"message": "run_block_function"});
	    	});
		    
		 });
	}

	//get all users already blocked and show them in popup
	chrome.storage.local.get('userList', function(storageObj) {

		userList = storageObj.userList;

		if(_.isUndefined(userList)) {
			userList = [];
		}

		displayBlockedUsers(userList);

	});

});
