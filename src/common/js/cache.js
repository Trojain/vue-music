// 缓存

// 引入storage的第三方库
import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 搜索
const SEARCH_MAX_LEN = 15 // 最大只缓存15条数据

const PLAY_KEY = '__play__' // 播放历史
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__' // 收藏
const FAVORITE_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
	const index = arr.findIndex(compare)
	if (index === 0) {
		return
	}
	if (index > 0) {
		arr.splice(index, 1)
	}
	arr.unshift(val)
	if (maxLen && arr.length > maxLen) {
		arr.pop()
	}
}

// 删除搜索记录
function deleteFromArray(arr, compare) {
	const index = arr.findIndex(compare)
	if (index > -1) {
		arr.splice(index, 1)
	}
}

// 缓存搜索历史
export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	insertArray(searches, query, (item) => {
		return item === query
	}, SEARCH_MAX_LEN)
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 删除单个搜索记录
export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY, [])
	deleteFromArray(searches, (item) => {
		return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
}

// 删除所有搜索记录
export function clearSearch() {
	storage.remove(SEARCH_KEY)
	return []
}

//从本地存储中获取搜索历史
export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

// 保存播放历史
export function savePlay(song) {
	let songs = storage.get(PLAY_KEY, [])
	insertArray(songs, song, (item) => {
		return song.id === item.id
	}, PLAY_MAX_LEN)
	storage.set(PLAY_KEY, songs)
	return songs
}

// 读取播放历史
export function loadPlay() {
	return storage.get(PLAY_KEY, [])
}

// 收藏
export function saveFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	insertArray(songs, song, (item) => {
		return song.id === item.id
	}, FAVORITE_MAX_LEN)
	storage.set(FAVORITE_KEY, songs)
	return songs
}

// 取消收藏
export function deleteFavorite(song) {
	let songs = storage.get(FAVORITE_KEY, [])
	deleteFromArray(songs, (item) => {
		return item.id === song.id
	})
	storage.set(FAVORITE_KEY, songs)
	return songs
}

// 加载收藏列表
export function loadFavorite() {
	return storage.get(FAVORITE_KEY, [])
}
