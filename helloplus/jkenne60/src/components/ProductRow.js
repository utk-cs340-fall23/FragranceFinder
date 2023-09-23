import React from 'react';
import sampleImage from '../logo192.png';

const fragranceRow = () => {
	return (
		<div className="row product">
		<div className="col-md-2">
		<img src={sampleImage} alt="Sample Image" height="100" />
		</div>
		<div className="col-md-8 product-detail">
		<h4>Summer Scent</h4>
		<p>Something to wear on a warm summer day at the pool.</p>
		</div>
		<div className="col-md-2 product-price">
		$59.99 
		</div>	
		</div>
	);
}

export default fragranceRow;