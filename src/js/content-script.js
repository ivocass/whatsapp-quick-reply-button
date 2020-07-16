const MESSAGE_OPTIONS_CSS_VARIABLE_KEY = "--whatsapp-quick-reply-button-message-options-visibility";
const REPLY_BUTTON_ICON_SOURCE = chrome.runtime.getURL("assets/reply-button-icon.png");

// it's reused every time we hover on a message
let replyButton;

document.addEventListener("mouseover", mouseOverListener);

function mouseOverListener(e) {
	let msgContainer;

	// if it's a message line (each line contains one message)
	if (e.target.classList.contains("_2hqOq")) {
		msgContainer = e.target;
	} else {
		// it may be a descendent of the line, so search upwards to see if the line is an ancestor
		msgContainer = e.target.closest("._2hqOq");

		if (!msgContainer) {
			return;
		}
	}

	// if it's a date separator, ignore it
	if (msgContainer.classList.contains("_2qhWD")) {
		return;
	}

	// get the message inside the line
	msgContainer = msgContainer.querySelector("._2et95");

	// if it hasn't been created yet. otherwise we reuse it
	if (!replyButton) {
		replyButton = document.createElement("img");

		replyButton.id = "quick-emojis-reply-button";
		replyButton.src = REPLY_BUTTON_ICON_SOURCE;
		replyButton.title = "Reply";

		replyButton.addEventListener("click", replyButtonClickListener);
	}

	// add the button as a child of the message if it isn't yet
	if (!replyButton.parentNode || replyButton.parentNode !== msgContainer) {
		msgContainer.appendChild(replyButton);
	}
}

function replyButtonClickListener() {
	// simulate a child of the message being hovered (for the message options button to show up)
	let el = replyButton.parentNode.querySelector("._3sKvP.wQZ0F");

	triggerMouseEvent(el, "mouseover");

	// now get the message options button to simulate a click
	let messageOptionsButton = document.querySelector("._2oA--");

	// messages with images have a message options button with a different class
	if (!messageOptionsButton) {
		messageOptionsButton = document.querySelector(".huqNi");
	}

	if (messageOptionsButton) {
		triggerMouseEvent(messageOptionsButton, "mousedown");

		// prevent the message options context menu from showing up
		document.body.style.setProperty(MESSAGE_OPTIONS_CSS_VARIABLE_KEY, "hidden");

		let realReplyButton;

		// get the line that contains the message
		let messageContainer = messageOptionsButton.closest("._2hqOq");

		// the REAL 'Reply' button is inside the context menu as the first option in messages we
		// received, and as the second option in messages that we sent
		if (messageContainer.classList.contains("message-in")) {
			realReplyButton = document.querySelector(".Ut_N0.n-CQr._2vuxN");
		} else if (messageContainer.classList.contains("message-out")) {
			realReplyButton = document.querySelectorAll(".Ut_N0.n-CQr._2vuxN")[1];
		}

		if (realReplyButton) {
			realReplyButton.click();
		}

		// make the context menu visible again
		setTimeout(() => {
			document.body.style.setProperty(MESSAGE_OPTIONS_CSS_VARIABLE_KEY, "visible");
		}, 1000);
	}
}

// thanks to Brock Adams (https://stackoverflow.com/a/24026594)
function triggerMouseEvent(node, eventType) {
	var clickEvent = document.createEvent("MouseEvents");
	clickEvent.initEvent(eventType, true, true);
	node.dispatchEvent(clickEvent);
}
