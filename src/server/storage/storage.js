const Storage = require('@google-cloud/storage');
const https = require('https');
const url = require('url');
const fs = require('fs');
const storage = new Storage({
	projectId: process.env.GOOGLE_CLOUD_PROJECT
});
const { Readable } = require('stream');
const readable = new Readable();

module.exports = {
	read: function(bucketName, filename) {
		const bucket = storage.bucket(bucketName);
		const file = bucket.file(filename);
		return file.createReadStream();
	},
	exist: function(bucketName, filename) {
		const bucket = storage.bucket(bucketName);
		const file = bucket.file(filename);
		return file.exists();
	},
	uploadLogo: function(bucketName, filename, logo, size) {
		const bucket = storage.bucket(bucketName);
		let storagedName = size ? filename.replace(/(\.[\w\d_-]+)$/i, `_${size}$1`) : filename;
		const file = bucket.file(storagedName);
		const stream = file.createWriteStream({
			metadata: {
				contentType: 'image/png'
			},
			public: true
		});
		return new Promise((resolve, reject) => {
			let isUrl = typeof logo === 'string' && url.parse(logo).protocol !== 'data:' && url.parse(logo).host;

			if (isUrl) {
				https
					.get(logo, (response) => {
						response.pipe(stream);
						stream.on('error', (err) => {
							console.log('error saving logo: ' + filename); // eslint-disable-line no-console
							console.log(err); // eslint-disable-line no-console
							reject();
						});
						stream.on('finish', () => {
							resolve(this.getPublicLink(bucketName, filename));
						});
					})
					.on('error', function(err) {
						console.log('error saving logo: ' + filename); // eslint-disable-line no-console
						console.log(err); // eslint-disable-line no-console
						reject();
					});
			} else {
				//is a local file

				//var buf = Buffer.from(logo);
				stream
					.on('finish', () => {
						resolve(this.getPublicLink(bucketName, filename));
					})
					.on('error', (err) => {
						console.log('error uploading default logo: ' + filename); // eslint-disable-line no-console
						console.log(err); // eslint-disable-line no-console
						reject();
					})
					.end(logo.pipe(stream));
			}
		});
	},

	getPublicLink: function(bucketName, filename) {
		return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
	}
};
