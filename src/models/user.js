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
          parent: true,
          foreignKey: 'groupId',
          localField: 'group',
        },
      },
      // hasMany: {
      //   user: {
      //     foreignKey: 'userIds',
      //     localField: 'friends',
      //     localKeys: 'userIds',
      //   },
      // },
    },
    graphql: {
      findAll: {
        query: (args) => gql`
          query users($ids: [ID]) {
            users(ids: $ids) {
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
