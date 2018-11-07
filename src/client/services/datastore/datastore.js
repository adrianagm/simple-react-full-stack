const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

module.exports = {
  key: function (kind) {
    let key = datastore.key({
      namespace: process.env.GCLOUD_DATASTORE_NAMESPACE,
      path: [kind]
    });
    return key;
  },

  list: function (options) {
    const query = datastore.createQuery(options.ns, options.entity);

    for (let key in options.filters) {
      if (options.filters.hasOwnProperty(key)) {
        if (typeof (options.filters[key]) === 'object') {
          let filter = options.filters[key];
          if (filter.hasOwnProperty('key') && filter.hasOwnProperty('operator') && filter.hasOwnProperty('value')) {
            query.filter(filter.key, filter.operator, filter.value);
          }
        } else {
          query.filter(key, '=', options.filters[key]);
        }
      }
    }

    if (options.limit) {
      query.limit(options.limit);
    } else {
      let pageSize = 500;
      query.limit(pageSize);
    }
    if (options.order) {
      query.order(options.order);
    }
    //pagination  500 by 500
    function runPageQuery(query, limit, pageCursor) {
      if (pageCursor) {
        query = query.start(pageCursor);
      }
      return datastore.runQuery(query).then(results => {
        let entities = results[0];
        let info = results[1];

        if (info.moreResults !== Datastore.NO_MORE_RESULTS && limit && entities.length < limit) {

          return runPageQuery(query, limit, info.endCursor).then(results => {
            results[0] = entities.concat(results[0]);
            return results;
          }).catch((err) => {
            console.log(err); // eslint-disable-line no-console
          });
        }
        return [entities, info];
      });
    }
    return runPageQuery(query, options.limit);
  },
  keys: function (options) {
    var keysOnlyQuery = datastore.createQuery(options.ns, options.entity).select(options.field);

    return datastore.runQuery(keysOnlyQuery);
  },
  save: function (entity, callback) {
    datastore.save(entity).then(() => {
      callback();
    }).catch(err => {
      console.error('ERROR:', err); // eslint-disable-line no-console
    });

  },
  update: function (entity) {
    return datastore.update(entity);
  },
  transaction: function () {
    return datastore.transaction();
  },
  bulkCreate: function (entities) {
    return datastore.upsert(entities);
  },
  bulkDelete: function (entities) {
    return datastore.delete(entities);
  }
};
