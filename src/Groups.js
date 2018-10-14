import React, { Component } from 'react';
import { withData } from './react-js-data';

class Groups extends Component {
  render() {
    const { groups, loading, actions = {} } = this.props;
    const { createGroup } = actions;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>Groups</h1>
        <pre>{JSON.stringify(groups, null, 2)}</pre>
        <button onClick={() => createGroup({ name: 'My Group' })}>
          Create Group
        </button>
      </div>
    );
  }
}

export default withData({
  name: 'groups',
  model: async (store) => await store.findAll('group'),
  actions: (store) => ({
    createGroup: async (args) => {
      const newGroup = store.createRecord('group', args);
      return await newGroup.save();
    },
  }),
})(Groups);
