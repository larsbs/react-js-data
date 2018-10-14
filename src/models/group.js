const group = (store) =>
  store.defineMapper('group', {
    endpoint: 'group',
    schema: {
      properties: {
        id: { type: 'number' },
        name: { type: 'string', track: true },
      },
    },
  });

export default group;
