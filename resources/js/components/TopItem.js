import React from 'react';

import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

class TopItem extends React.Component {

	constructor (props) {
		super(props);
	}
	render () {
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", alignSelf: "stretch", flexShrink: "0", margin: "8px 8px 8px 0px"}}>
			<p style={{fontSize: "24px", color: "#4bb34b", minWidth: "26px", margin: "0 16px 0 0"}}>{this.props.num}</p>
			<Avatar src={this.props.img_url}></Avatar>
			</div>
		)
	};
}

export default TopItem;