import "./CSS/email.css"

import React from "react";

const Email = () => {
	
	const handleFormSubmit = async () => {
		console.log("submit");
	}
	
    return (
        <div className="body">
            <h1>Enter an email address and get an email!</h1>
			<form onSubmit={handleFormSubmit}>
				<input type="text" placeholder="email@example.com" />
				<input type="submit" />
			</form>
        </div>
    );
};
 
export default Email;