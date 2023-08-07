import { showAlert } from "./alert";

export const login = async function (email, password) {
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
			showAlert("success", "Logged in successfully");
			setTimeout(() => {
				location.assign("/");
			}, 1500);
		} else {
			throw new Error(data.message);
		}
	} catch (e) {
		showAlert("error", e.message);
	}
};

