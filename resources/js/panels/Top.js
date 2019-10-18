import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import connect from '@vkontakte/vk-connect';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import List from '@vkontakte/vkui/dist/components/List/List';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

import TopItem from '../components/TopItem';


import Axios from 'axios';
import { timeout } from 'q';

const osName = platform();

class Top extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			activeTab: 'all',
			all: [],
			allData: null,
			friends: [],
			friendsData: null,
			groups: [],
			groupsData: null,
		};
	}
	getAllData(all_ids) {
		connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 7160668, "scope": "friends"})
			.then(res => {
				let token = res.access_token;
				connect.sendPromise("VKWebAppCallAPIMethod", {"method": "users.get", "request_id": "test-users-get", "params": {"user_ids": all_ids, "fields": "photo_100" , "v":"5.102", "access_token": token}})
					.then(res => {
						let vk_list = {};
						res.response.map(item => {
							vk_list[item.id] = {
								img_url: item.photo_100,
								last_name: item.last_name,
								first_name: item.first_name
							}
						})
						this.setState({ allData: vk_list });
					})
			})
	};
	getGroupsData(groups_ids) {
		connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 7160668, "scope": "groups"})
			.then(res => {
				let token = res.access_token;
				connect.sendPromise("VKWebAppCallAPIMethod", {"method": "groups.getById", "request_id": "test-groups-get", "params": {"group_ids": groups_ids, "v":"5.102", "access_token": token}})
					.then(res => {
						let groups_list = {};
						res.response.map(item => {
							groups_list[item.id] = {
								img_url: item.photo_100,
								name: item.name,
							}
						})
						this.setState({ groupsData: groups_list });
					})
			})
	};
	getTop(friends_ids) {
		Axios.post('/top', friends_ids)
			.then(res => {
				this.setState({ all: res.data.all })
				this.setState({ friends: res.data.friends })
				this.setState({ groups: res.data.groups })
				let all_ids = res.data.all.map(item => {
					return item.vk_id
				});
				this.getAllData(all_ids);
				let groups_ids = res.data.groups.map(item => {
					return item.group_id
				})
				this.getGroupsData(groups_ids);
			})
	};
	getFriendsTop() {
		connect.sendPromise("VKWebAppGetAuthToken", {"app_id": 7160668, "scope": "friends"})
			.then(res => {
				let token = res.access_token;
				connect.sendPromise("VKWebAppCallAPIMethod", {"method": "friends.get", "request_id": "test-friends-get", "params": {"fields": "photo_100" , "v":"5.102", "access_token": token}})
					.then(res => {
						let friends_list = {};
						let friends_ids = res.response.items.map(item => {
							friends_list[item.id] = {
								img_url: item.photo_100,
								last_name: item.last_name,
								first_name: item.first_name
							}
							return item.id;
						});
						this.setState({ friendsData: friends_list });
						this.getTop(friends_ids);
					})
			})
	};
	
	addToGroup() {
		connect.send("VKWebAppAddToCommunity", {});
	}
	
	componentDidMount() {
		this.getFriendsTop();
	};
	render () {
		return (
			<Panel id={this.props.id}>
				<PanelHeader
					left={<HeaderButton onClick={this.props.go} data-to="home">
						{osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
					</HeaderButton>}
				>
				Топ
				</PanelHeader>
				<FixedLayout vertical="top">
					<Tabs theme="header" type="buttons">
						<HorizontalScroll>
							<TabsItem
								onClick={() => this.setState({ activeTab: 'all' })}
								selected={this.state.activeTab === 'all'}
							>
								Все
							</TabsItem>
							<TabsItem
								onClick={() => this.setState({ activeTab: 'friends' })}
								selected={this.state.activeTab === 'friends'}
							>
								Друзья
							</TabsItem>
							<TabsItem
								onClick={() => this.setState({ activeTab: 'groups' })}
								selected={this.state.activeTab === 'groups'}
							>
								Сообщества
							</TabsItem>
						</HorizontalScroll>
					</Tabs>
				</FixedLayout>
				<Group title="image">
				<List>
					{this.state.activeTab === "all" && this.state.allData && this.state.all &&
						this.state.all.map((item, index) => {
							return <Cell
							key={item.vk_id}
							before={
								<TopItem
									num={index+1}
									imgUrl={this.state.allData[item.vk_id].img_url ? this.state.allData[item.vk_id].img_url : ""}
									href={"https://vk.com/id" + item.vk_id}>
								</TopItem>
								}
							description={"Слонов: " + item.count}
							>
							<span>{this.state.allData[item.vk_id].last_name ? this.state.allData[item.vk_id].last_name : item.vk_id} {this.state.allData[item.vk_id].first_name ? this.state.allData[item.vk_id].first_name : ""}</span>
							</Cell>;
						})
					}
					{this.state.activeTab === "friends" && this.state.friendsData &&
						this.state.friends.map((item, index) => {
							return <Cell
							key={item.vk_id}
							before={
								<TopItem
									num={index+1}
									imgUrl={this.state.friendsData[item.vk_id].img_url}
									href={"https://vk.com/id" + item.vk_id}>
								</TopItem>
								}
							description={"Слонов: " + item.count}
							>
							<span>{this.state.friendsData[item.vk_id].last_name} {this.state.friendsData[item.vk_id].first_name}</span>
							</Cell>;
						})
						
					}
					{this.state.activeTab === "groups" && this.state.groupsData &&
						this.state.groups.map((item, index) => {
							return <Cell
							key={item.group_id}
							before={
								<TopItem
									num={index+1}
									imgUrl={this.state.groupsData[item.group_id].img_url}
									href={"https://vk.com/club" + item.group_id}>
								</TopItem>
								}
							description={"Слонов: " + item.result}
							>
							<span>{this.state.groupsData[item.group_id].name}</span>
							</Cell>;
						})
					}
					<Cell></Cell>
					<Cell></Cell>
				</List>
				</Group>
				<FixedLayout vertical="bottom">
					<Button before={<Icon24Add/>} level="primary" size="xl" onClick={this.addToGroup}>
						<strong>Добавить в сообщество</strong>
					</Button>
				</FixedLayout>
			</Panel>
		)
	};
}

// Top.propTypes = {
// 	id: PropTypes.string.isRequired,
// 	go: PropTypes.func.isRequired,
// };

export default Top;
