import React from "react";

const Email = () => {
	
	const handleFormSubmit = async () => {
		console.log("submit");
	}
	
    return (
        <div>
            <h1>Enter an email address and get an email!</h1>
			<form>
				<input type="text" placeholder="email@example.com" />
				<input onClick={handleFormSubmit} type="submit" />
			</form>
        </div>
    );
};
 
export default Email;