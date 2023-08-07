import { login } from "./login";
import { displayMap } from "./map";

const formEl = document.querySelector(".form");

if (formEl) {
	const emailInputEl = formEl.querySelector("#email");
	const passwordInputEl = formEl.querySelector("#password");
	formEl.addEventListener("submit", function (e) {
		e.preventDefault();
		const email = emailInputEl.value;
		const password = passwordInputEl.value;
		login(email, password);
	});
}

if (document.querySelector("#map")) {
	displayMap();
}