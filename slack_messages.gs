// Some functions for formatting and sending messages to slack.
// For more slack formating, see:
// https://api.slack.com/tools/block-kit-builder

function contentServerJsonReply(message) {
  // "ContentServer" reply as Json.
  return ContentService
         .createTextOutput(message)
         .setMimeType(ContentService.MimeType.JSON);
}


function volunteerSuccessReply(slackurl, uniqueid, requesterName, mention_requestCoord, address, contactDetails, householdSituation,isFirstMessage) {
  var householdMessage = "";
  if (householdSituation != ""){
    householdMessage = "\nTheir household situation is: " + householdSituation + ".\n"
  }
  
  // personalise text depending on whether this is the first time volunteer sees the message or not
  if (isFirstMessage){
    var introTxt = ":nerd_face::tada: You signed up for <" + slackurl + "|request " + uniqueid + ">."
  } else{
    var introTxt = ":nerd_face::tada: You are still signed up for <" + slackurl + "|request " + uniqueid + ">."
  }
  
  // Json Template for replying to successful volunteer messages.
  return JSON.stringify({
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": introTxt
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
                "text": "The requester's name is " + requesterName + 
                        ".\n Their address is: " + address + 
                        ".\n And their contact details are: " + contactDetails +
                        householdMessage
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "When you are done, type `/done " + uniqueid + "`"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "To cancel your help offer, type `/cancel " + uniqueid + "`"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "To see this message again, type `/volunteer " + uniqueid + "`"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "If you need any help, please contact " + mention_requestCoord + "."
			}
		}
	]      
  });
}


function buildReplier(channelid, userid) {
  // Builds a function to mimic the action of ContentService via a post request.
  // Message is expected to be in the format { blocks: [...] }
  //
  // Use in conjunction with `return` to ensure that the rest of the function is
  // not executed.
  //
  // Example:
  // replier = buildReplier(...);
  // return replier(message);

  var webhook_chatPostMessage = globalVariables()['WEBHOOK_CHATPOSTMESSAGE_EPHEMERAL'];
  var access_token = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN'); 
  
  return function(message){
    message["channel"] = channlid;
    message["user"] = userid;
    var options = {
        method: "post",
        contentType: 'application/json; charset=utf-8',
        headers: {Authorization: 'Bearer ' + access_token},
        payload: JSON.stringify(message)
    };
    
    // Send post request to Slack chat.postMessage API
    var return_message = UrlFetchApp.fetch(webhook_chatPostMessage, options).getContentText();
    
    // Log results.
  
  }
}