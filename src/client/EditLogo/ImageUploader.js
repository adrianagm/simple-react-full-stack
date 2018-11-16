import React, { Component } from 'react';
import { render } from 'react-dom';
import './imageUploader.css';

var propTypes = {
		baseColor: 'gray',
		activeColor: 'green'
	},
	defaultProps = {
		baseColor: 'gray',
		activeColor: 'green',
		overlayColor: 'rgba(255,255,255,0.3)'
	};

class ImageUploader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			imageSrc: props.src,
			loaded: false
		};

		this.onDragEnter = this.onDragEnter.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
	}

	onDragEnter(e) {
		this.setState({ active: true });
	}

	onDragLeave(e) {
		this.setState({ active: false });
	}

	onDragOver(e) {
		e.preventDefault();
	}

	onDrop(e) {
		e.preventDefault();
		this.setState({ active: false });
		this.onFileChange(e, e.dataTransfer.files[0]);
	}

	onFileChange(e, file) {
		var file = file || e.target.files[0],
			pattern = /image-*/,
			reader = new FileReader();

		if (!file.type.match(pattern)) {
			alert('Formato inválido');
			return;
		}

		this.setState({ loaded: false });
		let imgEl = document.getElementById('logo_image');
		if (imgEl) {
			imgEl.onload = () => {
				this.props.callbackParent(imgEl.src, imgEl.naturalWidth);
			};
		}
		reader.onload = (e) => {
			this.setState({
				imageSrc: reader.result,
				loaded: true
			});
		};

		reader.readAsDataURL(file);
	}
	callbackParent(file) {
		let reader = new FileReader();
		reader.onload = (e) => {
			console.log(reader.result);
			this.props.callbackParent(reader.result);
		};
		reader.readAsArrayBuffer(file);
	}

	getFileObject() {
		return this.refs.input.files[0];
	}

	getFileString() {
		return this.state.imageSrc;
	}

	render() {
		let state = this.state,
			props = this.props,
			labelClass = `uploader ${state.loaded && 'loaded'}`,
			borderColor = state.active ? props.activeColor : props.baseColor,
			iconColor = state.active ? props.activeColor : state.loaded ? props.overlayColor : props.baseColor;

		return (
			<label
				className={labelClass}
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}
				onDragOver={this.onDragOver}
				onDrop={this.onDrop}
				style={{ outlineColor: borderColor }}
			>
				<img id="logo_image" src={state.imageSrc} className={state.loaded && 'loaded'} />
				<i className="icon icon-upload" style={{ color: iconColor }} />
				<input type="file" accept="image/*" onChange={this.onFileChange} ref="input" />
			</label>
		);
	}
}

ImageUploader.propTypes = propTypes;
ImageUploader.defaultProps = defaultProps;

export { ImageUploader };
