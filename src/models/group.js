import gql from 'fraql';

const group = (store) =>
  store.defineMapper('group', {
    endpoint: 'group',
    schema: {
      properties: {
        id: { type: 'number' },
        name: { type: 'string', track: true },
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
          query {
            group(id: ${args.id}) {
              id
              name
            }
          }
        `,
        transform: (data) => data.group,
      },
    },
  });

export default group;
