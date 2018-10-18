import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withData } from '../react-js-data';

class Groups extends Component {
  state = {
    name: '',
  };

  render() {
    const { groups, loading, actions } = this.props;
    const { name } = this.state;
    const { createGroup, updateGroup, deleteGroup } = actions;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>Groups</h1>
        <ul>
          {groups &&
            groups.map((group) => (
              <li key={group.id}>
                <Link to={`/group/${group.id}`}>{group.name}</Link>
              </li>
            ))}
        </ul>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
        <pre>{JSON.stringify(groups[0].users, null, 2)}</pre>
        <button onClick={() => createGroup({ name })}>Create Group</button>
        <input value={name} onChange={(e) => this.setState({ name: e.target.value })} />
        <button onClick={() => updateGroup(groups[0].id, { name })}>Update Group</button>
        <button onClick={() => deleteGroup(groups[0].id)}>Delete Group</button>
      </div>
    );
  }
}

export default withData({
  name: 'groups',
  model: async (store) => await store.findAll('group', {}, { with: ['user'] }),
  actions: (store) => ({
    createGroup: (args) => {
      const newGroup = store.createRecord('group', args);
      return newGroup.save();
    },
    updateGroup: (id, args) => {
      return store.update('group', id, args);
    },
    deleteGroup: (id) => {
      return store.destroy('group', id);
    },
  }),
})(Groups);
