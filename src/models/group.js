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
