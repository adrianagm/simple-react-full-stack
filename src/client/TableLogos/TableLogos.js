import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from '../Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// Import React Table

class TableLogos extends React.Component {
	constructor() {
		super();
		this.state = {
			headers: [],
			topLogos: [],
			noData: 'Loading...'
		};
	}

	componentDidMount() {
		fetch('/api/getLogos').then((res) => res.json()).then((data) => {
			let headers = makeHeaders(data.topLogos);
			headers[0].columns.push(this.addEditButton());
			this.setState({
				headers: headers,
				topLogos: data.topLogos,
				noData: 'The are not top logos or an error happened'
			});
		});
	}

	addEditButton = () => {
		return {
			Header: '',
			accessor: '',
			Cell: this.editButton.bind(this),
			width: 100
		};
	};

	selectLogo(row) {
		let id = row.original.id;
		window.location.href = '/editLogo?id=' + id;
	}

	editButton(cellInfo) {
		return (
			<button props={cellInfo} onClick={() => this.selectLogo(cellInfo)}>
				Edit
			</button>
		);
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

render(<TableLogos />, document.getElementById('root'));
