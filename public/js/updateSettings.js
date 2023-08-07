import { showAlert } from "./alert";

export const updateData = async (name, email) => {
	try {
		console.log(name, email);
		const result = await fetch("http://127.0.0.1:3000/api/v1/users/updateMe", {
			method: "PATCH",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify({
				name,
				email,
			}),
		});
		const data = await result.json();
		if (data.status === "success") {
			showAlert("success", "Data updated successfully");
		} else {
			throw new Error(data);
		}
	} catch (err) {
		showAlert("error", err.message);
	}
};