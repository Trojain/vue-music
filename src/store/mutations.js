const mutations = {
	// 歌手详情
	'SET_SINGER' (state, val) {
		state.singer = val;
	},

	// 设置vkey
	'SET_VKEY' (state, val) {
		state.vkey = val;
	},

	// 歌曲播放状态
	'SET_PLAYING_STATE' (state, val) {
		state.playing = val;
	},

	// 播放器展开或收起状态
	'SET_FULL_SCREEN' (state, val) {
		state.fullScreen = val;
	},

	// 歌曲播放列表
	'SET_PLAYLIST' (state, val) {
		state.playList = val;
	},

	// 歌曲顺序列表
	'SET_SEQUENCE_LIST' (state, val) {
		state.sequenceList = val;
	},

	// 歌曲播放模式
	'SET_MODE' (state, val) {
		state.mode = val;
	},

	//当前播放的歌曲索引
	'SET_CURRENT_INDEX' (state, val) {
		state.currentIndex = val;
	},

	//当前播放的歌曲索引
	'SET_DISC' (state, val) {
		state.disc = val;
	},

	//排行榜列表
	'SET_TOP_LIST' (state, val) {
		state.topList = val;
	},

	//搜索历史
	'SET_SEARCH_HISTORY' (state, val) {
		state.searchHistory = val;
	},

	// 播放历史
	'SET_PLAY_HISTORY' (state, val) {
		state.playHistory = val;
	},

	// 收藏列表
	'SET_FAVORITE_LIST' (state, val) {
		state.favoriteList = val;
	}

}
export default mutations;
