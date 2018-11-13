import React from 'react';
import { render } from 'react-dom';
import { makeFields } from '../Utils';

import queryString from 'query-string';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';

class EditLogo extends React.Component {
	constructor() {
		super();
		this.state = {
			fields: []
		};
	}

	componentDidMount() {
		const params = queryString.parse(location.search);
		this.id = params.id;
		if (this.id) {
			fetch('/api/getLogo/' + this.id).then((res) => res.json()).then((data) => {
				this.setState({
					fields: makeFields(data.topLogo),
					topLogo: data.topLogo
				});
			});
		}
	}

	change(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.state.topLogo[name] = value;
	}
	back() {
		window.location.href = '/';
	}
	save() {
		console.log(this.state);
		fetch('/api/updateLogo', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: this.id, data: this.state.topLogo })
		}).then(() => this.back());
	}

	render() {
		const { fields } = this.state;
		return (
			<div>
				<Form>
					<legend>Top Logo Edition</legend>
					{fields.map((field, idx) => {
						return (
							<Input
								label={field.label}
								type={field.type}
								name={field.name}
								defaultValue={field.defaultValue}
								onChange={(e) => this.change(e)}
							/>
						);
					})}
				</Form>
				<Button
					variant="raised"
					onClick={() => {
						this.save();
					}}
				>
					Save
				</Button>
				<Button variant="raised" onClick={this.back}>
					Cancel
				</Button>
			</div>
		);
	}
}

render(<EditLogo />, document.getElementById('root'));
