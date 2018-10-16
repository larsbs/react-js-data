import { Adapter } from 'js-data-adapter';
import { HttpAdapter } from 'js-data-http';
import get from 'lodash/get';
import { request } from 'graphql-request';
import { print } from 'graphql';

function _transform(transform, data) {
  const finalTransform = transform != null ? transform : (x) => x;
  return finalTransform(data);
}

export class GraphQLAdapter extends HttpAdapter {
  async findAll(mapper, query, opts) {
    const findAll = get(mapper, 'graphql.findAll', null);
    if (findAll == null) {
      return super.findAll(mapper, query, opts);
    }
    const args = {};
    const data = await request(this.graphqlPath, print(findAll.query(args)));
    return _transform(findAll.transform, data);
  }

  async find(mapper, query, opts) {
    const find = get(mapper, 'graphql.find', null);
    if (find == null) {
      return super.find(mapper, query, opts);
    }
    if (query == null) {
      return this.findAll(mapper, query, opts);
    }
    const args = { ...query };
    if (typeof query === 'string' || typeof query === 'number') {
      args.id = query;
    }
    const data = await request(this.graphqlPath, print(find.query(args)), args);
    return _transform(find.transform, data);
  }

  async create(mapper, props, opts) {
    const create = get(mapper, 'graphql.create', null);
    if (create == null) {
      return this.create(mapper, props, opts);
    }
    const args = { ...props };
    const data = await request(
      this.graphqlPath,
      print(create.query(args)),
      args,
    );
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
    const data = await request(
      this.graphqlPath,
      print(update.query(args)),
      args,
    );
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
    const data = await request(
      this.graphqlPath,
      print(destroy.query(args)),
      args,
    );
    return _transform(destroy.transform, data);
  }

  async destroyAll(mapper, query, opts) {
    return super.destroyAll(mapper, query, opts);
  }
}
