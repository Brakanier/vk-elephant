import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Top from './panels/Top';
import Axios from 'axios';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [player, setPlayer] = useState(window.player);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [authToken, setAuthToken] = useState(null);

	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			switch (type) {
			case 'VKWebAppUpdateConfig':
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
				break;
			case 'VKWebAppAccessTokenReceived':
				setAuthToken(data.access_token);
				break;
			}
		});
		
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' player={player} go={go} />
			<Top id='top' go={go} />
		</View>
	);
}

export default App;

