import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from './Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// Import React Table

class EditLogo extends React.Component {
	constructor() {
		console.log('edit');
		super();
		this.state = {
			headers: [],
			topLogos: [],
			noData: 'Loading edit...'
		};
	}

	componentDidMount() {
		this.setState({
			noData: 'edit'
		});
	}

	render() {
		const { headers, topLogos, noData } = this.state;
		return (
			<div>
				<ReactTable
					data={topLogos}
					columns={headers}
					noDataText={noData}
					defaultPageSize={10}
					className="-striped -highlight"
				/>
				<br />
			</div>
		);
	}
}

render(<EditLogo />, document.getElementById('root'));
