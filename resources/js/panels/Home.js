import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import connect from '@vkontakte/vk-connect';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon24MoneyCircle from '@vkontakte/icons/dist/24/money_circle';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import elephant from '../img/elephant.png';
import './Elephant.css';
import Axios from 'axios';

const Home = ({ id, go, player }) => {
	const [count, setCount] = useState(player.count);

	const addStory = () => {
		connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 7160668, "scope": "stories"})
		.then(res => {
			let token = res.access_token;
			connect.sendPromise("VKWebAppCallAPIMethod", {"method": "stories.getPhotoUploadServer", "request_id": "test-stories", "params": {"add_to_news": 1, "link_text": "view", "link_url": "https://vk.com/app7160668" , "v":"5.102", "access_token": token}})
			 .then(res => {
				 Axios.post('/story', {url: res.response.upload_url})
				 	.then(res => {
						 if (res.data.add) {
							setCount(count + 1);
						 }
					 })
			 })
		})
	}

	return (
	<Panel id={id}>
		<PanelHeader>Купи Слона!</PanelHeader>
		<Div>
			<img className="Elephant" src={elephant} alt="Elephant"/>
		</Div>
		<Div>
			<h1 style={{textAlign: "center"}}>У вас слонов: {count}</h1>
		</Div>

			<Div>
				<Button before={<Icon28UsersOutline/>} level="overlay_primary" size="xl" onClick={go} data-to="top">
					<strong>Топ</strong>
				</Button>
				
			</Div>
			<Div>
				<Button before={<Icon24MoneyCircle/>} level="commerce" size="xl">
					<strong>Купить слона</strong>
				</Button>
			</Div>
			<Div >
				<Button style={{ background: '#232323', color: "white" }} level="overlay_primary" size="xl" onClick={addStory}>
					<strong>Поделиться в истории (+1 слон)</strong>
				</Button>
			</Div>

	</Panel>
	)
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	player: PropTypes.object.isRequired
};

export default Home;
