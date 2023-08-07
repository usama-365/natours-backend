import {
	login,
	logout,
} from "./login";
import { displayMap } from "./map";
import {
	updateData,
	updatePassword,
} from "./updateSettings";

const formEl = document.querySelector(".form.form--login");
const logoutBtnEl = document.querySelector(".nav__el--logout");
const userDataFormEl = document.querySelector(".form-user-data");
const userPasswordFormEl = document.querySelector(".form-user-settings");

if (userDataFormEl) {
	userDataFormEl.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const name = document.getElementById("name").value;
		updateData(name, email);
	});
}

if (userPasswordFormEl) {
	userPasswordFormEl.addEventListener("submit", (e) => {
		e.preventDefault();
		const passwordCurrent = document.getElementById("password-current").value;
		const password = document.getElementById("password").value;
		const passwordConfirm = document.getElementById("password-confirm").value;
		updatePassword(passwordCurrent, password, passwordConfirm);
	});
}

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