import { Adapter } from 'js-data-adapter';
import { HttpAdapter } from 'js-data-http/src/index';
import { utils } from 'js-data';
import get from 'lodash/get';
import { request } from 'graphql-request';
import { print } from 'graphql';

function _transform(transform, data) {
  const finalTransform = transform != null ? transform : (x) => x;
  return finalTransform(data);
}

export class GraphQLAdapter extends HttpAdapter {
  async _find(mapper, query, opts) {
    const find = get(mapper, 'graphql.find', null);
    const args = { ...query };
    if (find == null) {
      return super._find(mapper, query, opts);
    }
    if (typeof query === 'string' || typeof query === 'number') {
      args.id = query;
    }
    const data = await request(this.graphqlPath, print(find.query(args)), args);
    return [_transform(find.transform, data), {}];
  }

  // async _findAll(mapper, query, opts) {
  //   const findAll = get(mapper, 'graphql.findAll', null);
  //   if (findAll == null) {
  //     return super._findAll(mapper, query, opts);
  //   }
  //   const args = { ...query, ids: query.relatedItemsIds };
  //   const data = await request(this.graphqlPath, print(findAll.query(args)), args);
  //   return [_transform(findAll.transform, data), {}];
  // }

  async create(mapper, props, opts) {
    const create = get(mapper, 'graphql.create', null);
    if (create == null) {
      return this.create(mapper, props, opts);
    }
    const args = { ...props };
    const data = await request(this.graphqlPath, print(create.query(args)), args);
    return _transform(create.transform, data);
  }

  async createMany(mapper, records, opts) {
    return super.createMany(mapper, records, opts);
  }

  async update(mapper, id, props, opts) {
    const update = get(mapper, 'graphql.update', null);
    if (update == null) {
      return super.update(mapper, id, props, opts);
    }
    const args = { ...props, id };
    const data = await request(this.graphqlPath, print(update.query(args)), args);
    return _transform(update.transform, data);
  }

  async updateMany(mapper, records, opts) {
    return super.updateMany(mapper, records, opts);
  }

  async updateAll(mapper, props, query, opts) {
    return super.updateAll(mapper, props, query, opts);
  }

  async destroy(mapper, id, opts) {
    const destroy = get(mapper, 'graphql.destroy', null);
    if (destroy == null) {
      return super.destroy(mapper, id, opts);
    }
    const args = { id };
    const data = await request(this.graphqlPath, print(destroy.query(args)), args);
    return _transform(destroy.transform, data);
  }

  async destroyAll(mapper, query, opts) {
    return super.destroyAll(mapper, query, opts);
  }

  async loadHasMany(mapper, def, records, __opts) {
    let singular = false;

    if (utils.isObject(records) && !utils.isArray(records)) {
      singular = true;
      records = [records];
    }
    const IDs = records.map((record) => this.makeHasManyForeignKey(mapper, def, record));

    const query = { where: {} };
    const criteria = (query.where[def.foreignKey] = {});
    if (singular) {
      criteria['=='] = IDs[0];
    } else {
      criteria['in'] = IDs.filter((id) => id);
    }
    if (records.every((record) => record[def.localField] != null)) {
      query.relatedItemsIds = records.reduce((memo, record) => {
        const ids = [];
        if (utils.isObject(record[def.localField][0])) {
          // an object like { id: 1 }
          ids.push(...record[def.localField].map((x) => x.id));
        } else {
          // an array of ids
          ids.push(...record[def.localField]);
        }
        return [...memo, ...ids];
      }, []);
    }
    return this.findAll(def.getRelation(), query, __opts).then((relatedItems) => {
      records.forEach((record) => {
        let attached = [];
        // avoid unneccesary iteration when we only have one record
        if (singular) {
          attached = relatedItems;
        } else {
          relatedItems.forEach((relatedItem) => {
            if (utils.get(relatedItem, def.foreignKey) === record[mapper.idAttribute]) {
              attached.push(relatedItem);
            }
          });
        }
        def.setLocalField(record, attached);
      });
    });
  }

  async loadBelongsTo(mapper, def, records, __opts) {
    const relationDef = def.getRelation();
    if (utils.isObject(records) && !utils.isArray(records)) {
      const record = records;
      return this.find(relationDef, this.makeBelongsToForeignKey(mapper, def, record), __opts).then(
        (relatedItem) => {
          const inverseDef = def.getInverse(mapper);
          delete relatedItem[inverseDef.localField];
          def.setLocalField(record, relatedItem);
        },
      );
    } else {
      const keys = records
        .map((record) => this.makeBelongsToForeignKey(mapper, def, record))
        .filter((key) => key);
      return this.findAll(
        relationDef,
        {
          where: {
            [relationDef.idAttribute]: {
              in: keys,
            },
          },
        },
        __opts,
      ).then((relatedItems) => {
        records.forEach((record) => {
          relatedItems.forEach((relatedItem) => {
            if (relatedItem[relationDef.idAttribute] === record[def.foreignKey]) {
              def.setLocalField(record, relatedItem);
            }
          });
        });
      });
    }
  }
}
