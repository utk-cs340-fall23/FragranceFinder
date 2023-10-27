function Forgot(){
	return(
		<div className="Auth-form-container">
		<form className="Auth-form">
			<div className="Auth-form-content">
				<h3 className="Auth-form-title">Forgot Password</h3>
				<div className="form-group mt-3">
					<label>Email address: </label>
					<input name="email"></input>
				</div>
				<div className="d-grd gap-2 mt-3">
					<button type="submit" className="btn btn-primary">Submit</button>
				</div>
				<p className="text-center mt-2"> 
					<a href="/">HOME</a>
				</p>
			</div>
		</form>
	</div>
	)
}

export default Forgot;
