import { reducer as form } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import example from './example.jsx';

export default {
	example,
	form,
	routing: (state, action) => {
		if (action.type === '@@router/LOCATION_CHANGE') {
			// timeout required as page update has to happen outside this loop for some reason
			if (!/\/test[1-2]\/[a-z]/ig.test(action.payload.pathname)) {
				setTimeout(() => {
					document.body.scrollTop = document.documentElement.scrollTop = 0;
				}, 0);
			}
		}
		return routerReducer(state, action);
	}
};
