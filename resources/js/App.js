import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Alert from '@vkontakte/vkui/dist/components/Alert/Alert';
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
			const isMember = await connect.sendPromise("VKWebAppCallAPIMethod", {"method": "groups.isMember", "request_id": "test_is_member", "params": {"group_id": "187614443", "user_id": user.id, "v":"5.102", "access_token": "a81d820ea81d820ea81d820e6da870c152aa81da81d820ef5847ad56e6918099b98d949"}})
			setPopout(null);
			if (isMember.response == 0) {
				setPopout(<Alert
					actions={[{
					  title: 'Нет',
					  autoclose: true,
					  style: 'cancel'
					}, {
					  title: 'Да',
					  autoclose: true,
					  action: goSubscribe
					}]}
					onClose={closePopout}
				  >
					<h2>Поддержать разработчиков?</h2>
					<p>Вы можете поддержать разработчиков, подписавшиcь на сообщество Clover Team</p>
				  </Alert>);
			}
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	const showPopout = (value) => {
		setPopout(value);
	}

	const closePopout = () => {
		setPopout(null);
	}

	const goSubscribe = () => {
		connect.send("VKWebAppJoinGroup", {"group_id": 187614443});
	}

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id='home' player={player} go={go} showPopout={showPopout}/>
			<Top id='top' go={go} showPopout={showPopout} player={player} user={fetchedUser}/>
		</View>
	);
}

export default App;

