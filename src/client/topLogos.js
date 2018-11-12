const LogoModel = require('./LogoModel');

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

module.exports = {
	get,
	getLogoById
};
