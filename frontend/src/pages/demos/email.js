import "../CSS/email.css"

import React from "react";
import {useState} from "react";
import { sendPost } from "../../utils/requests";

const Email = () => {
	const [form, setForm] = useState({
		email: "",
		title: "",
		body: ""
	})

	const handleForm = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value
		});
	}

	const handleFormSubmit = async(event) => {
		event.preventDefault();
		await sendPost("/api/email/", form);
	}

    return (
        <div className="body">
            <h1>Enter an email address and get an email!</h1>
			<form onSubmit={handleFormSubmit}>
				<input type="text" name="email" onChange={handleForm} value={form.email} placeholder="email@example.com" />
				<input type="text" name="title" onChange={handleForm} value={form.title} placeholder="Title" />
				<textarea name="body" onChange={handleForm} value={form.body} placeholder="Body" />
				<input type="submit" />
			</form>
        </div>
    );
};

export default Email;