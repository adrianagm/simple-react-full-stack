import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from './Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// Import React Table

class TableLogos extends React.Component {
	constructor() {
		super();
		this.state = {
			headers: [],
			topLogos: []
		};
	}

	componentDidMount() {
		fetch('/api/getLogos').then((res) => res.json()).then((data) => {
			this.setState({
				headers: makeHeaders(data.topLogos),
				topLogos: data.topLogos
			});
		});
	}

	render() {
		const { headers, topLogos } = this.state;

		console.log('headers', headers);
		console.log('logos', topLogos);
		return (
			<div>
				<ReactTable data={topLogos} columns={headers} defaultPageSize={10} className="-striped -highlight" />
				<br />
			</div>
		);
	}
}

render(<TableLogos />, document.getElementById('root'));
