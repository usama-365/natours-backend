import {
	login,
	logout,
} from "./login";
import { displayMap } from "./map";
import { updateData } from "./updateSettings";

const formEl = document.querySelector(".form.form--login");
const logoutBtnEl = document.querySelector(".nav__el--logout");
const userDataFormEl = document.querySelector(".form-user-data");

if (userDataFormEl) {
	userDataFormEl.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const name = document.getElementById("name").value;
		updateData(name, email);
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