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

// simulate a double-click on the message line, which triggers a message reply
function replyButtonClickListener(e) {
	let msgLine = e.target.closest("._2hqOq");

	if (msgLine) {
		var event = new MouseEvent("dblclick", {
			view: window,
			bubbles: true,
			cancelable: true,
		});

		msgLine.dispatchEvent(event);
	}
}
