import React from 'react';
import './index.css';

const excludedFields = [ 'schema_version', 'altImg' ];

const makeCell = (item, value) => {
	if (value === undefined) {
		return value;
	}
	switch (item) {
		case 'img':
		case 'altImg':
			return (
				<div class="table-img">
					<div class="headers">
						<span>1x</span>
						<span>2x</span>
					</div>
					<img width="70" src={value.replace(/(\.[\w\d_-]+)$/i, `_1x$1`)} />
					<img width="70" src={value.replace(/(\.[\w\d_-]+)$/i, `_2x$1`)} />
				</div>
			);
			break;
		case 'tags':
			var tags = value.map((v) => <div>{v}</div>);
			return <div> {tags} </div>;
			break;
		case 'website':
			let href = value.startsWith('http') ? value : '//' + value;
			return (
				<a target="_blank" href={href}>
					{value}
				</a>
			);
			break;
		case 'logoEnabled':
			var circleStyle = {
				'margin-left': '45%',
				display: 'inline-block',
				backgroundColor: value ? '#57d500' : '#ff2e00',
				borderRadius: '50%',
				width: 10,
				height: 10
			};
			return (
				<div>
					<div style={circleStyle}> </div>
				</div>
			);
			break;
		default:
			var style = {
				height: '70px',
				width: '100%'
			};
			return <div style={style}> {value} </div>;
	}
};

export function makeHeaders(topLogos) {
	let columns = [];
	topLogos.forEach((l) => {
		Object.keys(l).map(function(item, pos) {
			let header = item.replace(/([a-z](?=[A-Z]))/g, '$1 ');
			let column = {
				Header: header[0].toUpperCase() + header.substring(1),
				accessor: item,
				Cell: (row) => makeCell(item, row.value),
				width: item === 'img' ? 160 : item === 'logoEnabled' ? 70 : 'auto'
			};

			if (!columns.find((c) => c && c.accessor === item)) {
				if (item === 'name') {
					columns.unshift(column);
				} else if (item === 'img') {
					columns.unshift(column);
				} else if (item === 'website') {
					columns.unshift(column);
				} else if (excludedFields.indexOf(item) === -1) {
					columns.push(column);
				}
			}
		});
	});
	console.log(columns);
	let headers = [
		{
			Header: `Top Logos (${topLogos.length})`,
			columns: columns
		}
	];
	return headers;
}

export const Tips = () => (
	<div
		style={{
			textAlign: 'center'
		}}
	>
		<em> Tip: Hold shift when sorting to multi - sort! </em>{' '}
	</div>
);
