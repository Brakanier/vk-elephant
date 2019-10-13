import React from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Tabs from '@vkontakte/vkui/dist/components/Tabs/Tabs';
import TabsItem from '@vkontakte/vkui/dist/components/TabsItem/TabsItem';
import HorizontalScroll from '@vkontakte/vkui/dist/components/HorizontalScroll/HorizontalScroll';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import List from '@vkontakte/vkui/dist/components/List/List';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import TopItem from '../components/TopItem';

import { timeout } from 'q';

const osName = platform();

class Top extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			activeTab: 'all',
			top: []
		};
	}
	top() {
		this.props.items.map((item, index) => {
			return <Cell
			before={<TopItem num={index+1} imgUrl={item.url}></TopItem>}
			description={item.count}
			>
			{item.name}
			</Cell>;
		});
	}
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
					{top}
				</List>
				</Group>
			</Panel>
		)
	};
}

Top.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Top;
