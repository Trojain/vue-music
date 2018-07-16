// 用jsonp抓QQ音乐线上数据
// 1.推荐接口

// 引入自己封装好的jsonp
import jsonp from 'common/js/jsonp'
// 引入jsonp的公用参数配置
import {
	commonParams,
	options
} from './config'
import axios from 'axios'

// 推荐
export function getRecommend() {
	// 线上接口地址
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

	// es6合并对象
	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	})

	return jsonp(url, data, options)
}

// 歌单
export function getDiscList() {
	// 通过后端代理的方式请求接口 修改webpack-dev-conf.js配置
	const url = '/api/getDiscList'

	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		hostUin: 0,
		sin: 0,
		ein: 29,
		sortId: 5,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
	})

	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

// 推荐歌曲列表
export function getSongList(disstid) {
	const url = '/api/getSongList'
	const data = Object.assign({}, commonParams, {
		disstid: disstid,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
		g_tk: 93237530,
		loginUin: 0
	})
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

// 歌曲URL
export function getMusic(mid) {
	const url = '/api/getMusic'
	const data = Object.assign({}, commonParams, {
		singermid: mid,
		songmid: mid,
		// filename: "C400" + mid + ".m4a",
		filename: `C400${mid}.m4a`,
		guid: 6217354311,
		cid: 205361747,
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq',
		order: 'listen',
		begin: 0,
		num: 80,
		songstatus: 1,
		format: 'json'
	})
	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}
