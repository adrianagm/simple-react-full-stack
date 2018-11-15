const LogoModel = require('./LogoModel');
const storage = require('./storage/storage');
const bucketName = `pro-${process.env.GOOGLE_CLOUD_PROJECT}-logos`;
const dataUriToBuffer = require('data-uri-to-buffer');
const sharp = require('sharp');
const size1x = 96,
	size2x = 192;

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
	let logoModel = new LogoModel();
	let logo = dataUriToBuffer(req.body.data.img);
	let logoName = req.body.data.name.replace(/\s+/g, '');

	req.body.data.img = await saveLogos(logo, logoName);
	let saved = await logoModel.update(req.body.data, req.body.id);
	res.send(saved);
}

async function saveLogos(logo, name) {
	// secondary image added too
	// resizeImg(logo, name, true);
	// let link = await resizeImg(logo, name);
	// return link;
	return storage.uploadLogo(bucketName, name, logo);
}
async function resizeImg(logo, name, secondarySize) {
	return new Promise((resolve) => {
		let sizes = getSizes(secondarySize, logo.size);
		let logoName = name.replace('.jpg', `_${sizes.size}.jpg`);

		sharp(logo).resize(sizes.pxSize).toFile(logoName).then((resized) => {
			resolve(storage.uploadLogo(bucketName, logoName, resized, sizes.size));
		});
	});
}
function getSizes(secondarySize, logoSize) {
	let pxSize, size;
	if (secondarySize) {
		pxSize = logoSize === '1x' ? size2x : size1x;
		size = logoSize === '1x' ? '2x' : '1x';
	} else {
		pxSize = logoSize === '1x' ? size1x : size2x;
		size = logoSize;
	}
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
