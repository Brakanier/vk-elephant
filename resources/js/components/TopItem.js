import React from 'react';

import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Link from '@vkontakte/vkui/dist/components/Link/Link';

class TopItem extends React.Component {

	constructor (props) {
		super(props);
	}
	render () {
		return (
			<Link href={this.props.href} target="_blank">
			<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", alignSelf: "stretch", flexShrink: "0", margin: "8px 8px 8px 0px"}}>
			<p style={{fontSize: "24px", color: "#2787f5", minWidth: "26px", margin: "0 8px 0 8px"}}>{this.props.num}</p>
			{this.props.this_user && <Avatar style={{border: "3px solid #2787f5"}} src={this.props.imgUrl}></Avatar>}
			{!this.props.this_user && <Avatar src={this.props.imgUrl}></Avatar>}
			</div>
			</Link>

		)
	};
}

export default TopItem;