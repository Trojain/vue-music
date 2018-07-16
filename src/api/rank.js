import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// 获取排行榜数据
export function getTopList() {
	const url = '/api/toplist'
	const data = Object.assign({}, commonParams, {
		uin: 0,
		needNewCode: 1,
		platform: 'h5',
		g_tk: 93237530
	})

	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

// 获取排行榜详情数据
export function getMusicList(topid) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
	const data = Object.assign({}, commonParams, {
		topid,
		needNewCode: 1,
		uin: 0,
		tpl: 3,
		page: 'detail',
		type: 'top',
		platform: 'h5'
	})

	return jsonp(url, data, options)
}
