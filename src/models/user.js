import gql from 'fraql';

const user = (store) =>
  store.defineMapper('user', {
    endpoint: 'user',
    schema: {
      properties: {
        id: { type: ['number', 'string'] },
        nick: { type: 'string' },
      },
    },
    relations: {
      belongsTo: {
        group: {
          foreignKey: 'group_id',
          localField: 'group',
        },
      },
    },
    graphql: {
      findAll: {
        query: (args) => gql`
          query {
            users {
              id
              nick
            }
          }
        `,
        transform: (data) => data.users,
      },
      find: {
        query: (args) => gql`
          query user($id: ID!) {
            user(id: $id) {
              id
              nick
            }
          }
        `,
        transform: (data) => data.user,
      },
    },
  });

export default user;
