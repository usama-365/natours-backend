const formEl = document.querySelector(".form");
const emailInputEl = formEl.querySelector("#email");
const passwordInputEl = formEl.querySelector("#password");

const login = async function (email, password) {
	try {
		const result = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		const data = await result.json();
		if (data.status === "success") {
			alert("Logged in successfully");
			setTimeout(() => {
				location.assign("/");
			}, 1500);
		}
	} catch (e) {
		alert(e.message);
	}
};

document.querySelector(".form").addEventListener("submit", function (e) {
	e.preventDefault();
	const email = emailInputEl.value;
	const password = passwordInputEl.value;
	login(email, password);
});