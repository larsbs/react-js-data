import gql from 'fraql';

const group = (store) =>
  store.defineMapper('group', {
    endpoint: 'group',
    schema: {
      properties: {
        id: { type: ['number', 'string'] },
        name: { type: 'string' },
      },
    },
    relations: {
      hasMany: {
        user: {
          foreignKey: 'group_id',
          localField: 'users',
        },
      },
    },
    graphql: {
      findAll: {
        query: (args) => gql`
          query {
            groups {
              id
              name
            }
          }
        `,
        transform: (data) => data.groups,
      },
      find: {
        query: (args) => gql`
          query group($id: ID!) {
            group(id: $id) {
              id
              name
            }
          }
        `,
        transform: (data) => data.group,
      },
      create: {
        query: (args) => gql`
          mutation createGroup($name: String) {
            createGroup(name: $name) {
              id
              name
            }
          }
        `,
        transform: (data) => data.createGroup,
      },
      update: {
        query: (args) => gql`
          mutation updateGroup($id: ID!, $name: String) {
            updateGroup(id: $id, name: $name) {
              id
              name
            }
          }
        `,
        transform: (data) => data.updateGroup,
      },
      destroy: {
        query: (args) => gql`
          mutation deleteGroup($id: ID!) {
            deleteGroup(id: $id) {
              id
              name
            }
          }
        `,
        transform: (data) => data.deleteGroup,
      },
    },
  });

export default group;
