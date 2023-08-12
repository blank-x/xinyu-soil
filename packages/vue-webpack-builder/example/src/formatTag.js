
import tt from './tt';
tt()
const tagsData = {
	g: {
		text: '热门',
		tag: 'good'
	},
	l: {
		text: '推荐',
		tag: 'like'
	},
	t: {
		text: '置顶',
		tag: 'top'
	},
	a: {
		text: '广告',
		tag: 'tg'
	},
	r: {
		text: '相关',
		tag: 'relate'
	}
};

const typesData = {
	g: {
		text: '动图',
		tag: 'gif'
	},
	// p: {
	// 	text: '图集',
	// 	tag: 'album'
	// },
	v: {
		text: '视频',
		tag: 'video'
	},
	y: {
		text: '视频',
		tag: 'video'
	}
};

function formatTag(tag) {
	let tagColors = [{
		tags: ['社会', '国际', '国内'],
		color: '#5996fd'
	}, {
		tags: ['科技', '汽车', '互联网', '科学探索'],
		color: '#53a4cf'
	}, {
		tags: ['健康', '美食', '育儿', '孕期', '养生', '家居'],
		color: '#a97cef'
	}, {
		tags: ['军事', '历史'],
		color: '#68a285'
	}, {
		tags: ['财经', '股票', '房产'],
		color: '#dbb263'
	}, {
		tags: ['旅游', '星座', '情感', '动物'],
		color: '#b86c47'
	}, {
		tags: ['体育', '教育'],
		color: '#20b6bc'
	}, {
		tags: ['搞笑', '娱乐', '综艺', '时尚', '游戏', '明星八卦'],
		color: '#f26687'
	}];
	for (let i = 0; i < tagColors.length; i++) {
		if (tagColors[i].tags.indexOf(tag) > -1) {
			return tagColors[i].color;
		}
	}
	// for(let tagInfo of tagColors){
	// 	if (tagInfo.tags.indexOf(tag) > -1) {
	// 		return tagInfo.color;
	// 	};
	// }
	return '#f89934';
}

module.exports = function (item) {
	//   目前问题定位到，是会先判断a的值，在List里才会显示红印章。

	// 现确认此处识别attr逻辑如下：
	// 1.       只要有attr，优先根据attr的content和color字段显示红印章
	// 2.       没有attr字段时，在youlike中，且分类是顶部频道展现出来的channel时，展现频道名称，颜色用现有的map（现有逻辑,需要保留）
	// 3.       非视频频道下，s=g,v,y，这三个会分别显示动图，视频和视频tag（这是现有逻辑，如果容易去掉可以去掉，如果不好去掉就先保留）
	// 4.       若以上3条都不满足，则不显示任何tag
	// liuziwen 2019-08-22

	// 只显示attr数据 liuziwen, 2019-08-29

	// let tagData = tagsData[item.a];
	// if (tagData) {
	//   return {
	//     color: null,
	//     tag: tagData.tag,
	//     text: item.attr ? item.attr[0].content : tagData.text
	//   };
	// }
	if (Array.isArray(item.attr) && item.attr.length && parseInt(item.attr[0].isdisplay) === 1) {
		return {
			color: '#' + item.attr[0].color,
			tag: null,
			text: item.attr[0].content,
			pos: parseInt(item.attr[0].pos)
		};
	}


	// if (ch === 'youlike') {
	//   for (let i = 0; i < channels.length; i++) {
	//     if (channels[i].c === item.c) {
	//       return {
	//         color: formatTag(channels[i].name),
	//         tag: item.c,
	//         text: channels[i].name
	//       };
	//     }
	//   }
	// }

	// tagData = typesData[item.s];
	// // 视频频道的s都是视频，不需要显示标签
	// if (tagData && ch !== 'video') {
	//   return {
	//     color: null,
	//     tag: tagData.tag,
	//     text: tagData.text
	//   };
	// }

	return {
		color: null,
		tag: null,
		text: null
	};
};
