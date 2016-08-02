import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore, push} from 'react-router-redux';
import {connect} from 'react-redux';
import {Panel, PanelHeader} from 'rebass';
import isEqual from 'lodash/isEqual';
import { StickyContainer, Sticky } from 'react-sticky';
import { Element as ScrollElement, Events as ScrollEvents, scroller } from 'react-scroll';

import App from '../layouts/App.jsx';

function PaddedChild(name) {
	return (props) => {
		return <StickyContainer>
			<Panel style={{height: 800}}>
				<Sticky style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}} onStickyStateChange={(isSticky) => {if (isSticky) props.activate()}}>
					<PanelHeader>
						<p>{name}</p>
					</PanelHeader>
				</Sticky>
				<p>{props.test}</p>
			</Panel>
		</StickyContainer>;
	};
}

class _ScrolledChild extends Component {
	componentWillMount() {
		ScrollEvents.scrollEvent.register('end', (to, element) => this.props.dispatch(push(`/${this.props.route.path}/${to}`)));
	}
	componentDidMount() {
		if (this.props.route.path !== this.props.routes[this.props.routes.length - 1].path) {
			scroller.scrollTo(this.props.routes[this.props.routes.length - 1].path, {
				isDynamic: true
			});
		}
	}
	componentDidUpdate(prevProps) {
		if (prevProps.route.path !== this.props.route.path) {
			scroller.scrollTo(this.props.routes[this.props.routes.length - 1].path, {
				smooth: true,
				isDynamic: true,
				duration: 300
			});
		}
	}
	render() {
		return <div>
			{this.props.route.childRoutes.map(route => <ScrollElement key={route.path} name={route.path}>
				{React.createElement(route.component, {activate: () => {
					this.props.dispatch(push(`/${this.props.route.path}/${route.path}`));
				}})}
			</ScrollElement>)}
		</div>;
	}
}
let ScrolledChild = connect()(_ScrolledChild);

function generatePage(routeName, childRoutes) {
	return {
		path: routeName,
		component: ScrolledChild,
		childRoutes: childRoutes.map(path => ({
			path,
			component: PaddedChild(path)
		}))
	};
}

export default class RootRouter extends Component {
	constructor(props) {
		super(props);
		this.routeConfig = [
			{
				path: '/',
				component: (props) => <App {...props} routeConfig={this.routeConfig}/>,
				indexRoute: {
					onEnter: (targetState, replace) => {
						replace('/test1');
					}
				},
				childRoutes: [generatePage('test1', ['child1','child2','child3','child4','child5','child6']),generatePage('test2', ['present1','present2','present3','present4','present5'])]
			}
		];
	}

	render() {
		let history = syncHistoryWithStore(browserHistory, this.props.store);
		return (
			<Router history={history} routes={this.routeConfig}>
			</Router>
		);
	};
}
