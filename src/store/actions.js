// actions用来提交异步或多事件批量处理

import { playMode } from 'common/js/config'
import { shuffle } from "common/js/util";
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite }
from "common/js/cache";

function findIndex(list, song) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

// 选择播放
export const selectPlay = function ({ commit, state }, { list, index }) {
	// 多事件批量处理 提交mutation
	commit('SET_SEQUENCE_LIST', list)
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit('SET_PLAYLIST', randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit('SET_PLAYLIST', list)
	}
	commit('SET_CURRENT_INDEX', index)
	commit('SET_FULL_SCREEN', true)
	commit('SET_PLAYING_STATE', true)
}

// 随机播放按钮
export const randomPlay = function ({ commit, state }, { list }) {
	commit('SET_MODE', playMode.random)
	commit('SET_SEQUENCE_LIST', list)
	let randomList = shuffle(list)
	commit('SET_PLAYLIST', randomList)
	commit('SET_CURRENT_INDEX', 0)
	commit('SET_FULL_SCREEN', true)
	commit('SET_PLAYING_STATE', true)
}

// 搜索结果中播放歌曲
export const insertSong = function ({ commit, state }, song) {
	// 用.slice()复制出一个state的副本，否则直接修改了state属性(×)
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
	let currentSong = playList[currentIndex]
	// 查找当前列表中是否有待插入的歌曲并返回其索引
	let fpIndex = findIndex(playList, song)
	// 因为是插入歌曲，所以索引+1
	currentIndex++
	// 插入这首歌到当前索引位置
	playList.splice(currentIndex, 0, song)
	// 如果已经包含了这首歌
	if (fpIndex > -1) {
		// 如果当前插入的序号大于列表中的序号
		if (currentIndex > fpIndex) {
			playList.splice(fpIndex, 1)
			currentIndex--
		} else {
			playList.splice(fpIndex + 1, 1)
		}
	}

	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let fsIndex = findIndex(sequenceList, song)
	sequenceList.splice(currentSIndex, 0, song)
	if (fsIndex > -1) {
		if (currentSIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1)
		} else {
			sequenceList.splice(fsIndex + 1, 1)
		}
	}

	commit('SET_PLAYLIST', playList)
	commit('SET_SEQUENCE_LIST', sequenceList)
	commit('SET_CURRENT_INDEX', currentIndex)
	commit('SET_FULL_SCREEN', true)
	commit('SET_PLAYING_STATE', true)
}

// 搜索历史
export const saveSearchHistory = function ({ commit }, query) {
	// 将query提交到mutation并保存在storage中
	commit('SET_SEARCH_HISTORY', saveSearch(query));
}

// 删除单个搜索历史
export const deleteSearchHistory = function ({ commit }, query) {
	commit('SET_SEARCH_HISTORY', deleteSearch(query));
}

// 删除所有搜索历史
export const clearSearchHistory = function ({ commit }) {
	commit('SET_SEARCH_HISTORY', clearSearch()); // 返回空数组 清除localstorage
}

export const deleteSong = function ({ commit, state }, song) {
	let playlist = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let pIndex = findIndex(playlist, song)
	playlist.splice(pIndex, 1)
	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)
	if (currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--
	}
	commit('SET_PLAYLIST', playlist)
	commit('SET_SEQUENCE_LIST', sequenceList)
	commit('SET_CURRENT_INDEX', currentIndex)

	const playingState = playlist.length > 0
	commit('SET_PLAYING_STATE', playingState)

	// if (!playlist.length) {
	// 	commit('SET_PLAYING_STATE', false)
	// } else {
	// 	commit('SET_PLAYING_STATE', true)
	// }
}

export const deleteSongList = function ({ commit }) {
	commit('SET_CURRENT_INDEX', -1)
	commit('SET_PLAYLIST', [])
	commit('SET_SEQUENCE_LIST', [])
	commit('SET_PLAYING_STATE', false)
}

// 播放历史
export const savePlayHistory = function ({ commit }, song) {
	commit('SET_PLAY_HISTORY', savePlay(song))
}

// 收藏
export const saveFavoriteList = function ({ commit }, song) {
	commit('SET_FAVORITE_LIST', saveFavorite(song))
}

// 取消收藏
export const deleteFavoriteList = function ({ commit }, song) {
	commit('SET_FAVORITE_LIST', deleteFavorite(song))
}
