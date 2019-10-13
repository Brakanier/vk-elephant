import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import Icon24MoneyCircle from '@vkontakte/icons/dist/24/money_circle';
import elephant from '../img/elephant.png';
import './Elephant.css';

const Home = ({ id, go, player }) => (
	<Panel id={id}>
		<PanelHeader>Купи Слона!</PanelHeader>

			<img className="Elephant" src={elephant} alt="Elephant"/>
			<h1 style={{textAlign: "center"}}>У вас слонов: {player.count}</h1>


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
				<Button style={{ background: '#232323', color: "white" }} level="overlay_primary" size="xl">
					<strong>Поделиться в истории (+1 слон)</strong>
				</Button>
			</Div>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	player: PropTypes.object.isRequired
};

export default Home;
