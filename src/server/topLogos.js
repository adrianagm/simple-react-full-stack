const LogoModel = require('./LogoModel');
const storage = require('./storage/storage');
const bucketName = `pro-${process.env.GOOGLE_CLOUD_PROJECT}-logos`;
const dataUriToBuffer = require('data-uri-to-buffer');
const sharp = require('sharp');
const size1x = 96,
	size2x = 192;
var uploading = false;

async function get(req, res) {
	let logoModel = new LogoModel();
	let topLogos = await logoModel.list();
	let logos = topLogos[0].map((l) => logoModel.parseFromDatastore(l));
	res.send({
		topLogos: logos
	});
}

async function getLogoById(req, res) {
	let id = req.params.id;
	let logoModel = new LogoModel();
	let topLogo = await logoModel.searchById(id);
	res.send({
		topLogo: topLogo[0][0]
	});
}

async function update(req, res) {
	if (uploading) {
		return;
	}
	uploading = true;
	let logoModel = new LogoModel();
	let logo = dataUriToBuffer(req.body.data.img);
	let logoName = req.body.data.name.replace(/\s+/g, '');

	req.body.data.img = await saveLogos(logo, logoName);
	let saved = await logoModel.update(req.body.data, req.body.id);
	uploading = false;
	res.send(saved);
}

async function saveLogos(logo, name) {
	// secondary image added too
	resizeImg(logo, name, '2x');
	let link = await resizeImg(logo, name, '1x');
	return link;
}
async function resizeImg(logo, name, size) {
	return new Promise((resolve) => {
		let sizes = getSizes(size);
		let logoName = name.toLowerCase();

		let resizedLogo = sharp(Buffer.from(logo)).resize(sizes.pxSize).png();
		resolve(storage.uploadLogo(bucketName, logoName + `.png`, resizedLogo, sizes.size));
	});
}
function getSizes(logoSize) {
	let pxSize, size;

	pxSize = logoSize === '2x' ? size2x : size1x;
	size = logoSize === '2x' ? '2x' : '1x';

	return {
		pxSize: pxSize,
		size: size
	};
}

module.exports = {
	get,
	getLogoById,
	update
};
