import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from '../Utils';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// Import React Table

class TableLogos extends React.Component {
	constructor(props) {
		super();
		console.log(props);
		this.state = {
			headers: [],
			topLogos: [],
			noData: 'Loading...',
			page: 0,
			pageSize: 10,
			sorted: []
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
		console.log(this.state.page);
		window.location.href = '/editLogo?id=' + id;
	}

	editButton(cellInfo) {
		return (
			<button props={cellInfo} onClick={() => this.selectLogo(cellInfo)}>
				Edit
			</button>
		);
	}
	pageChange(page) {
		this.setState({ page: page + 1 });
		console.log(this.state);
	}
	pageSizeChange(pageSize) {
		this.setState({ pageSize: pageSize });
	}
	pageSortedChange(sorted) {
		this.setState({ sorted: sorted });
	}

	render() {
		const { headers, topLogos, noData, page, pageSize, sorted } = this.state;
		return (
			<div>
				<ReactTable
					data={topLogos}
					columns={headers}
					noDataText={noData}
					defaultPageSize={pageSize}
					page={page}
					sorted={sorted}
					onPageChange={(p) => {
						this.pageChange(p);
					}}
					onPageSizeChange={(s) => {
						this.pageSizeChange(s);
					}}
					onSortedChange={(s) => {
						this.pageSortedChange(s);
					}}
					className="-striped -highlight"
				/>
				<br />
			</div>
		);
	}
}

render(<TableLogos />, document.getElementById('root'));
