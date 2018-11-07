const LogoModel = require('./LogoModel');

module.exports = async function (req, res) {
  let logoModel = new LogoModel();
  let topLogos = await logoModel.list();
  let columns = [];
  topLogos[0].forEach((l) => {
    let logoFields = [];
    Object.keys(l).map(function (item, pos) {

      let column = {
        Header: item,
        accesor: item
      };
      if (!columns.find(c => c && c.accesor === item)) {
        logoFields.push(column);
      }
    });
    columns = columns.concat(logoFields);

  });
  console.log(columns);
  let headers = [{

    columns: columns
  }];

  res.send({
    headers: headers,
    topLogos: topLogos,
    columns: columns
  });
};
