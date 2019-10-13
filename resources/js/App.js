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
	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		
		async function fetchData() {
			const user = await connect.sendPromise('VKWebAppGetUserInfo');
			setUser(user);
			// Axios.get('http://127.0.0.1:8000/')
			// 	.then(res => {
			// 		const player = res.data;
			// 		setPlayer(player);
			// 	})
			setPopout(null);
		}
		fetchData();
	}, []);

	const getTop = () => {
		connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 7160668, "scope": "friends"})
			.then(res => {
				console.log(res.access_token);
				let token = res.access_token;
				
				Axios.get('/top')
					.then(res => {
					console.log(res.data);
					let user_ids = res.data.map((item, index) => {
						return item.vk_id
					});
					connect.sendPromise("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "test-users-get", "params": {"user_ids": user_ids, "v":"5.102", "access_token": token}})
						.then(res => {
							console.log(res);
						})
					
				})

			})
		
		
	}

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

