const LogoModel = require('./LogoModel');

async function get(req, res) {
  let logoModel = new LogoModel();
  let topLogos = await logoModel.list();

  res.send({
    topLogos: topLogos[0]
  });
};


module.exports = {
  get
}
