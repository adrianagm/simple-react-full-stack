const datastoreService = require('./datastore/datastore');
const Datastore = require('@google-cloud/datastore');
const schemaVersion = 1;

module.exports = class LogoModel {
	constructor() {
		this.kind = 'logo';
	}

	list(filters, limit, order) {
		let filter = {
			entity: this.kind,
			ns: process.env.GCLOUD_DATASTORE_NAMESPACE
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

	parseFromDatastore(data) {
		const key = data[Datastore.KEY] ? data[Datastore.KEY] : datastoreService.key(this.kind);
		data.id = key.id;
		return data;
	}

	searchById(id) {
		let key = datastoreService.key(this.kind, id);
		let filters = { __key__: key };
		return this.list(filters, 1);
	}

	parseData(data, id) {
		const entity = {
			key: id
				? datastoreService.key(this.kind, id)
				: data[Datastore.KEY] ? data[Datastore.KEY] : datastoreService.key(this.kind),
			data: this.toDatastore(data, this.indexFields)
		};
		return entity;
	}

	saveInDatastore(entity) {
		return new Promise((resolve, reject) => {
			datastoreService.save(entity, (err) => {
				if (!err) {
					resolve(entity);
				} else {
					console.log('error saving in datastore.' + err); // eslint-disable-line no-console
					reject();
				}
			});
		});
	}

	async update(data, id) {
		data['schema-version'] = this.schemaVersion;
		data.lastModifiedDate = new Date();
		data.logoEnabled = true;
		data.source = 'default';
		let entity = this.parseData(data, id);
		return datastoreService.update(entity);
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

	bulkDelete(entities) {
		datastoreService.bulkDelete(entities);
	}
	bulkCreate(entities) {
		return datastoreService.bulkCreate(entities);
	}
};
