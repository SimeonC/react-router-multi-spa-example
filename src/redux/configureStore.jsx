// Use ProvidePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
import {combineReducers} from 'redux';
import rootReducer from './reducers';
import { browserHistory } from 'react-router';
import * as Events from './events.jsx';

let appReducer = combineReducers(rootReducer);

export default () => {
	let configureStore;
	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
		configureStore = require('./configureStore.prod.jsx').default(appReducer, browserHistory);
	} else {
		configureStore = require('./configureStore.dev.jsx').default(appReducer, browserHistory);
	}
	return configureStore();
};
