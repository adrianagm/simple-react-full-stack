const datastoreService = require('./services/datastore/datastore');
const Datastore = require('@google-cloud/datastore');

module.exports = class LogoModel {
  constructor() {
    this.kind = 'logo';
  }

  list(filters, limit, order) {
    let filter = {
      entity: this.kind,
      ns: process.env.GCLOUD_DATASTORE_NAMESPACE,
      limit: limit
    };

    if (filters) {
      filter.filters = filters;
    }

    if (order) {
      filter.order = order;
    }

    if (limit) {
      filter.limit = limit;
    }

    return datastoreService.list(filter);
  }

  parseData(data) {
    const entity = {
      key: data[Datastore.KEY] ? data[Datastore.KEY] : datastoreService.key(this.kind),
      data: this.toDatastore(data, this.indexFields)
    };
    return entity;
  }

  saveInDatastore(entity) {
    return new Promise((resolve, reject) => {
      datastoreService.save(
        entity,
        (err) => {
          if (!err) {
            resolve(entity);
          } else {
            console.log('error saving in datastore.' + err); // eslint-disable-line no-console
            reject();
          }
        }
      );
    });
  }

  toDatastore(obj, indexed) {
    indexed = indexed || [];
    const results = [];
    Object.keys(obj).forEach((k) => {
      if (obj[k] === undefined) {
        return;
      }
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: indexed.indexOf(k) === -1
      });
    });
    return results;
  }

  removeEntities(entities) {
    let results = entities,
      keysToRemove = [];
    for (let i = 0; i < results.length; i++) {
      keysToRemove.push(results[i][Datastore.KEY]);
    }
    return datastoreService.bulkDelete(keysToRemove);
  }
  update(entity) {
    datastoreService.update(entity);
  }

  bulkDelete(entities) {
    datastoreService.bulkDelete(entities);
  }
  bulkCreate(entities) {
    return datastoreService.bulkCreate(entities);
  }
};
