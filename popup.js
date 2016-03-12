console.log('start popup.js');
var userList;

var $ignoredUserUL;
var $addButton;
var $userNameField;

jQuery(document).ready(function() {
	console.log('popup.js doc ready');
	//cache jquery refs
	$ignoredUserUL = jQuery('.ignoredUsers');
	$addButton = jQuery('.addToListButton');
	$userNameField = jQuery('.userNameField');

	function displayBlockedUsers(aUserList) {
		console.log('start display blocked users');
		console.log('aUserList.length: '+ aUserList.length);
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
		console.log('end display blocked users');

	}

	function unblockUser(userNameToRemove) {
		console.log('begin unblockUser');
		chrome.storage.local.get('userList', function(storageObj) {
			console.log('storage accessed');
			console.log(storageObj.userList);

			userList = storageObj.userList;

			userList = _.without(userList, userNameToRemove);

			console.log('attempt to set user list in storage');
			chrome.storage.local.set({userList : userList}, function() {
				console.log('user list set in storage successfully');
	    		console.log('attempt to query active tab for current window');
	    		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				    console.log('active tab accessed');
				    var activeTab = tabs[0];
				    console.log(activeTab);
				    
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

    		console.log('attempting to set user list from blockUserFromInputField');
	    	chrome.storage.local.set({userList : userList}, function() {
    			
    			console.log('userlist accessed: ' + userList);
    			$userNameField.val('');
    			displayBlockedUsers(userList);

				console.log('sending run block function message');
	    		chrome.tabs.sendMessage(activeTab.id, {"message": "run_block_function"});
	    	});
		    
		 });
	}

	//get all users already blocked and show them in popup
	console.log('attempt to get user list from stoarge to show in popup');
	chrome.storage.local.get('userList', function(storageObj) {
		userList = storageObj.userList;
		console.log('got userList: ' + userList);

		if(_.isUndefined(userList)) {
			userList = [];
		}

		displayBlockedUsers(userList);

	});

});
