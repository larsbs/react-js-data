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
          foreignKey: 'groupId',
          localField: 'group',
        },
      },
    },
    graphql: {
      findAll: {
        query: (args) => gql`
          query users($relatedIds: [ID]) {
            users(ids: $relatedIds) {
              id
              nick
              groupId
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
              groupId
            }
          }
        `,
        transform: (data) => data.user,
      },
    },
  });

export default user;
