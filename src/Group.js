import React, { Component } from 'react';
import { withData } from './react-js-data';

class Group extends Component {
  render() {
    const { group, loading, actions } = this.props;
    const { updateGroup } = actions;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>{group ? group.name : 'Unnamed'}</h1>
        <pre>{JSON.stringify(group, null, 2)}</pre>
        <pre>{JSON.stringify(group.users, null, 2)}</pre>
        <input
          value={group.name}
          onChange={(e) => updateGroup(group.id, { name: e.target.value })}
        />
      </div>
    );
  }
}

export default withData({
  name: 'group',
  model: async (store, ownProps) =>
    await store.find('group', ownProps.match.params.id),
  actions: (store) => ({
    updateGroup: (id, args) => {
      return store.update('group', id, args);
    },
  }),
})(Group);
