import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        <h1>User: {user ? user.nick : 'Unnamed'}</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <input value={user.nick} onChange={(e) => updateUser(user.id, { name: e.target.value })} />
        <h2>Group</h2>
        <Link to={`/group/${user.group.id}`}>{user.group.name}</Link>
        <pre>{JSON.stringify(user.group, null, 2)}</pre>
        <h2>Peers</h2>
        <pre>{JSON.stringify(user.group.users, null, 2)}</pre>
        <h2>Friends</h2>
        <pre>{JSON.stringify(user.friends, null, 2)}</pre>
        <Link to="/">Groups</Link>
      </div>
    );
  }
}

export default withData({
  name: 'user',
  model: async (store, ownProps) => {
    await store.find('group', '1', { with: ['user'] });
    return await store.find('user', ownProps.match.params.id, { with: ['group', 'user'] });
  },
  actions: (store) => ({
    updateUser: (id, args) => {
      return store.update('user', id, args);
    },
  }),
})(User);
