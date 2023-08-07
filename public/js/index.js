import {
	login,
	logout,
} from "./login";
import { displayMap } from "./map";

const formEl = document.querySelector(".form.form--login");
const logoutBtnEl = document.querySelector(".nav__el--logout");

if (logoutBtnEl) {
	logoutBtnEl.addEventListener("click", logout);
}

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