import {enterNameContainer ,enterNameInput ,enterNameSubmitBtn} from "../main.js";

async function checkAlreadyExistsUsername(username) { 
	const response = await fetch(`/userAlreadyExist?username=${encodeURIComponent(username)}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const result = await response.json();
	return result;
}

export function init() {
	if (localStorage.getItem("username") === null) {

		const onSubmit = async () => {
			const username = enterNameInput.value.trim();
			if (username) {
				if (await checkAlreadyExistsUsername(username)) {
					alert("Username already exists. Please choose another one.");
					return;
				}
				
				localStorage.setItem("username", username);
				enterNameContainer.remove();
			} else {
				alert("Please enter a valid name.");
			}
		};

		enterNameSubmitBtn.addEventListener("click", onSubmit);
	} else {
		enterNameContainer.remove();
	}
}

export function getUsername() {
	return localStorage.getItem("username");
}