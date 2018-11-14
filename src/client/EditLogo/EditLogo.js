import React, { Component } from 'react';
import { render } from 'react-dom';
import { makeFields } from '../Utils';

import queryString from 'query-string';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import MultiSelectReact from 'multi-select-react';

class EditLogo extends React.Component {
	constructor() {
		super();
		this.state = {
			fields: [],
			invalidForm: false
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
		this.validateField(name, value);
		this.setState({
			invalidForm: this.state.fields.find((f) => f.invalid === true)
		});
		this.state.topLogo[name] = value;
		if (name === 'tags' && name === 'types') {
			this.state.topLogo[name] = value.split(',');
		}
	}
	validateField(name, value) {
		let field = this.state.fields.find((f) => f.name === name);
		if (!field) {
			return;
		}
		field.invalid = false;
		switch (name) {
			case 'website':
				var re = /[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
				console.log(!re.test(value));
				field.invalid = !re.test(value);
				break;
			default:
				field.invalid = false;
		}
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
	optionClicked(optionsList) {
		this.setState({ selectOptions: [ 'hola' ] });
	}
	selectedBadgeClicked(optionsList) {
		this.setState({ selectOptions: [ 'hola' ] });
	}

	render() {
		const { fields, invalidForm } = this.state;
		const selectedOptionsStyles = {
			color: '#3c763d',
			backgroundColor: '#dff0d8'
		};
		const optionsListStyles = {
			backgroundColor: '#dff0d8',
			color: '#3c763d'
		};
		console.log(fields);
		return (
			<div>
				<Form>
					<legend>Top Logo Edition</legend>
					{fields.map((field, idx) => {
						if (field.type === 'multiselect') {
							return (
								<div class="mui-textfield">
									<label for={field.name}>{field.name}</label>
									<MultiSelectReact
										name={field.name}
										options={field.options}
										optionClicked={this.optionClicked.bind(this)}
										selectedBadgeClicked={this.selectedBadgeClicked.bind(this)}
										selectedOptionsStyles={selectedOptionsStyles}
										optionsListStyles={optionsListStyles}
									/>
								</div>
							);
						} else {
							return (
								<Input
									label={field.label}
									type={field.type}
									name={field.name}
									invalid={field.invalid}
									defaultValue={field.defaultValue}
									onChange={(e) => this.change(e)}
								/>
							);
						}
					})}
				</Form>
				<div class="form-buttons">
					<Button
						disabled={invalidForm}
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
			</div>
		);
	}
}

render(<EditLogo />, document.getElementById('root'));
