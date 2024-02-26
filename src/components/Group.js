import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withData } from '../react-js-data';

class Group extends Component {
  render() {
    const { group, loading, actions } = this.props;
    const { updateGroup } = actions;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>Group: {group ? group.name : 'Unnamed'}</h1>
        <ul>
          {group &&
            group.users.map((user) => (
              <li key={user.id}>
                <Link to={`/user/${user.id}`}>{user.nick}</Link>
              </li>
            ))}
        </ul>
        <pre>{JSON.stringify(group, null, 2)}</pre>
        <pre>{JSON.stringify(group.users, null, 2)}</pre>
        <input
          value={group.name}
          onChange={(e) => updateGroup(group.id, { name: e.target.value })}
        />
        <Link to="/">Groups</Link>
      </div>
    );
  }
}

export default withData({
  name: 'group',
  model: async (store, ownProps) =>
    await store.find('group', ownProps.match.params.id, { with: ['user'] }),
  actions: (store) => ({
    updateGroup: (id, args) => {
      return store.update('group', id, args);
    },
  }),
})(Group);
