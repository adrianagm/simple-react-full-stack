import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from '../Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// Import React Table
import queryString from 'query-string';

class TableLogos extends React.Component {
	constructor(props) {
		super();
		const { page, pageSize } = queryString.parse(location.search);
		this.state = {
			headers: [],
			topLogos: [],
			noData: 'Loading...',
			page: page ? parseInt(page) : 0,
			pageSize: pageSize ? parseInt(pageSize) : 10
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
		const { page, pageSize } = this.state;
		let query = {
			id: id,
			page: page,
			pageSize: pageSize
		};
		const stringified = queryString.stringify(query);
		window.location.href = '/editLogo?' + stringified;
	}

	editButton(cellInfo) {
		return (
			<button props={cellInfo} onClick={() => this.selectLogo(cellInfo)}>
				Edit
			</button>
		);
	}
	pageChange(page) {
		this.setState({ page: page });
	}
	pageSizeChange(pageSize) {
		console.log(pageSize);
		this.setState({ pageSize: pageSize });
	}

	render() {
		const { headers, topLogos, noData, page, pageSize } = this.state;
		return (
			<div>
				<ReactTable
					data={topLogos}
					columns={headers}
					noDataText={noData}
					defaultPageSize={pageSize}
					page={page}
					sortable={false}
					onPageChange={(p) => {
						this.pageChange(p);
					}}
					onPageSizeChange={(s) => {
						this.pageSizeChange(s);
					}}
					className="-striped -highlight"
				/>
				<br />
			</div>
		);
	}
}

render(<TableLogos />, document.getElementById('root'));
