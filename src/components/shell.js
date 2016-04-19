import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store from '../store';
import React from 'react';
import routes from './routes';
import history from '../helpers/history';
import initFirebase from '../sources/firebase';

class Shell extends React.Component {
	componentDidMount() {
	}

	render () {
		return (
			<Provider store={store}>
				<Router history={history} ref="router">
					{ routes }
				</Router>
			</Provider>
		)
	}
}

export default Shell;
