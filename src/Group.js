import React, { Component } from 'react';
import { withData } from './react-js-data';

class Group extends Component {
  render() {
    const { group, loading, actions = {} } = this.props;
    if (loading) {
      return 'Loading...';
    }
    return (
      <div>
        <h1>{group ? group.name : 'Unnamed'}</h1>
        <pre>{JSON.stringify(group, null, 2)}</pre>
      </div>
    );
  }
}

export default withData({
  name: 'group',
  model: async (store, ownProps) =>
    await store.find('group', ownProps.match.params.id),
})(Group);
