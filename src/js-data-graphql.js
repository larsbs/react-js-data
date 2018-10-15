import { Adapter } from 'js-data-adapter';
import { HttpAdapter } from 'js-data-http';
import get from 'lodash/get';
import { request } from 'graphql-request';
import { print } from 'graphql';

export class GraphQLAdapter extends HttpAdapter {
  async findAll(mapper, query, opts) {
    const findAll = get(mapper, 'graphql.findAll', null);
    if (findAll == null) {
      return super.findAll(mapper, query, opts);
    }
    const data = await request(this.graphqlPath, print(findAll.query()));
    const transform = findAll.transform != null ? findAll.transform : (x) => x;
    return transform(data);
  }
}
