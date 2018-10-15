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

      constructor(props) {
        super(props);
        this._handleSubscribe = this._handleSubscribe.bind(this);
      }

      async componentDidMount() {
        this.setState({ loading: true });
        const { store } = this.props;
        const modelData = await model(store, this.props);
        store.subscribe(this._handleSubscribe);
        this.setState({
          loading: false,
          modelData,
        });
      }

      componentWillUnmount() {
        const { store } = this.props;
        store.unsubscribe(this._handleSubscribe);
      }

      render() {
        const { store } = this.props;
        const { loading, modelData } = this.state;
        const data = { [name]: modelData };
        const bindedActions =
          typeof actions === 'function' ? actions(store) : {};
        return (
          <WrappedComponent
            {...this.props}
            loading={loading}
            {...data}
            actions={bindedActions}
          />
        );
      }

      async _handleSubscribe() {
        const { store } = this.props;
        this.setState({ modelData: await model(store, this.props) });
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
