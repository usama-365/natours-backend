import { showAlert } from "./alert";

export const updateData = async (form) => {
	try {
		const result = await fetch("http://127.0.0.1:3000/api/v1/users/updateMe", {
			method: "PATCH",
			body: form,
		});
		const data = await result.json();
		if (data.status === "success") {
			showAlert("success", "Data updated successfully");
		} else {
			throw new Error(data);
		}
	} catch (err) {
		console.log(err);
		showAlert("error", err.message);
	}
};

export const updatePassword = async (currentPassword, password, passwordConfirm) => {
	try {
		const result = await fetch("http://127.0.0.1:3000/api/v1/users/updateMyPassword", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify({
				currentPassword,
				password,
				passwordConfirm,
			}),
		});
		const data = await result.json();
		if (data.status === "success") {
			showAlert("success", "Password updated successfully");
		} else {
			throw new Error(data);
		}
	} catch (err) {
		console.log(err);
		showAlert("error", err.message);
	}
};