import React, {Component} from 'react';
import ProductRow from './ProductRow';

class fragranceList extends Component {
	constructor(props) {
		super(props);
  }

	render() {
		return (
			<div className="container main-content">
			<ProductRow />
        	<ProductRow />
			</div>
    	);
	}
}

export default fragranceList;