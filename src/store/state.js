// 歌曲播放模式
import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'

const state = {
	singer: {}, // 歌手详情
	vkey: "",
	playing: false, // 歌曲播放状态
	fullScreen: false, // 播放器展开或收起状态
	playList: [], // 歌曲播放列表
	sequenceList: [], // 歌曲顺序列表
	mode: playMode.sequence, // 歌曲播放模式
	currentIndex: -1, //当前播放的歌曲索引
	disc: {}, // 推荐歌单详情
	topList: {}, //排行榜列表
	searchHistory: loadSearch(), // 从本地存储中获取搜索历史
	playHistory: loadPlay(), // 播放历史
	favoriteList: loadFavorite() // 收藏列表
}

export default state
