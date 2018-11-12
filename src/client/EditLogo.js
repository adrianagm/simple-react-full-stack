import React from 'react';
import { render } from 'react-dom';
import { makeHeaders } from './Utils';

import queryString from 'query-string';
const excludedFields = [ 'schema_version', 'altImg', 'id', 'creationDate', 'lastModifiedDate' ];

class EditLogo extends React.Component {
	constructor() {
		console.log('edit');
		super();
		this.state = {
			headers: [],
			topLogo: {}
		};
	}

	componentDidMount() {
		const params = queryString.parse(location.search);
		if (params.id) {
			fetch('/api/getLogo/' + params.id).then((res) => res.json()).then((data) => {
				this.setState({
					topLogo: data.topLogo
				});
			});
		}
	}

	render() {
		const { headers, topLogo, noData } = this.state;
		console.log(topLogo);
		return (
			<div>
				<form>
					{Object.keys(topLogo).map((key, idx) => {
						let inputId = `input-${key}`,
							val = topLogo[key];
						return (
							<div key={idx}>
								<label htmlFor={inputId}>{key}</label>
								<input
									type="text"
									name={inputId}
									data-id={idx}
									id={inputId}
									value={val}
									className="name"
								/>
							</div>
						);
					})}
					<input type="submit" value="Save" />
				</form>
			</div>
		);
	}
}

render(<EditLogo />, document.getElementById('root'));
