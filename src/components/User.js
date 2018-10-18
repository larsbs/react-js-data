import React, { Component } from 'react';
import { withData } from '../react-js-data';

class User extends Component {
  render() {
    const { user, loading, actions } = this.props;
    const { updateUser } = actions;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>{user ? user.nick : 'Unnamed'}</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <pre>{JSON.stringify(user.group, null, 2)}</pre>
        <pre>{JSON.stringify(user.group.users, null, 2)}</pre>
        <input value={user.nick} onChange={(e) => updateUser(user.id, { name: e.target.value })} />
      </div>
    );
  }
}

export default withData({
  name: 'user',
  model: async (store, ownProps) => {
    await store.find('group', '1', { with: ['user'] });
    return await store.find('user', ownProps.match.params.id, { with: ['group'] });
  },
  actions: (store) => ({
    updateUser: (id, args) => {
      return store.update('user', id, args);
    },
  }),
})(User);
