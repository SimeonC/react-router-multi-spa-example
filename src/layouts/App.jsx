import React, {Component, PropTypes} from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {scroller} from 'react-scroll';
import GlobalTranslation from '../components/GlobalTranslations.jsx';
import {Panel} from 'rebass';

class App extends Component {
	openPath(parentPath, path) {
		if (parentPath === this.props.routes[this.props.routes.length - 1].path || parentPath === this.props.routes[this.props.routes.length - 2].path) {
			scroller.scrollTo(path, {
				smooth: true,
				isDynamic: true,
				duration: 300
			});
		} else {
			this.props.dispatch(push(`/${parentPath}/${path}`));
		}
	}
	render() {
		return <div style={{paddingRight: 180}}>
			<Panel style={{position: 'fixed', right: 10, top: 10}}>
				{this.props.routeConfig[0].childRoutes.map(parentRoute =>
					<ul key={parentRoute.path}>
						<li>{parentRoute.path}</li>
						{parentRoute.childRoutes.map(route => {
							let style = {};
							if (this.props.routes[this.props.routes.length - 1].path === route.path) {
								style.backgroundColor = 'red';
							}
							return <li key={route.path}><a href="#" style={style} onClick={event => {
								this.openPath(parentRoute.path, route.path);
								event.preventDefault();
							}}>{route.path}</a></li>;
						})}
					</ul>
				)}
			</Panel>
			{this.props.children}
		</div>;
	};
}

export default connect()(App);
