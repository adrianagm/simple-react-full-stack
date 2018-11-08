import React from 'react';
import './index.css';

const excludedFields = [ 'schema_version', 'altImg' ];

const makeCell = (item, value) => {
	if (!value) {
		return value;
	}
	switch (item) {
		case 'img':
		case 'altImg':
			return <img width="70" src={value.replace(/(\.[\w\d_-]+)$/i, `_1x$1`)} />;
			break;
		case 'tags':
			var tags = value.map((v) => <div>{v}</div>);
			console.log(tags);
			return <div> {tags} </div>;
			break;
		case 'website':
			return (
				<a target="_blank" href={'//' + value}>
					{value}
				</a>
			);
			break;
		case 'enabled':
			var circleStyle = {
				padding: 10,
				'margin-left': '45%',
				'margin-top': '30px',
				display: 'inline-block',
				backgroundColor: value === 'true' ? '#57d500' : '#ff2e00',
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
				Cell: (row) => makeCell(item, row.value)
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
