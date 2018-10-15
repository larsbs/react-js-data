import React, { Component } from 'react';

const { Provider, Consumer } = React.createContext();

export function withData(kwargs) {
  const { model, name = 'model', actions } = kwargs;
  return (WrappedComponent) => {
    class WithData extends Component {
      state = {
        loading: true,
        modelData: null,
      };

      async componentDidMount() {
        this.setState({ loading: false });
        const { store } = this.props;
        const modelData = await model(store);
        store.subscribe(async () =>
          this.setState({ modelData: await model(store) }),
        );
        this.setState({
          loading: false,
          modelData,
        });
      }

      render() {
        const { store } = this.props;
        const { loading, modelData } = this.state;
        const data = { [name]: modelData };
        const bindedActions = actions(store);
        return (
          <WrappedComponent
            {...this.props}
            loading={loading}
            {...data}
            actions={bindedActions}
          />
        );
      }
    }

    return (props) => (
      <Consumer>{(store) => <WithData {...props} store={store} />}</Consumer>
    );
  };
}

export class JsDataProvider extends Component {
  render() {
    const { children, store } = this.props;
    return <Provider value={store}>{children}</Provider>;
  }
}
