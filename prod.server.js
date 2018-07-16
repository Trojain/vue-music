//配置dist目录下的nodeserver   http://localhost:9000

var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()
var apiRoutes = express.Router()

// 获取歌单
apiRoutes.get('/getDiscList', (req, res) => {
	var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
	axios.get(url, {
		headers: {
			referer: "https://c.y.qq.com/",
			host: 'c.y.qq.com'
		},
		params: req.query
	}).then(response => {
		res.json(response.data)
	}).catch(e => {
		console.log(e)
	})
})

// 获取推荐歌单
apiRoutes.get('/getSongList', function (req, res) {
	var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
	axios.get(url, {
		headers: {
			referer: 'https://y.qq.com/',
			host: 'c.y.qq.com'
		},
		params: req.query
	}).then((response) => {
		var ret = response.data;
		if (typeof ret === 'string') {
			var reg = /({.*})\)$/
			var mathes = ret.match(reg)
			if (mathes) {
				ret = JSON.parse(mathes[1])
			}
		}
		res.json(ret)
	}).catch((e) => {
		console.log(e)
	})
})

// 获取歌词
apiRoutes.get('/lyric', (req, res) => {
	var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
	axios.get(url, {
		headers: {
			referer: "https://c.y.qq.com/",
			host: 'c.y.qq.com'
		},
		params: req.query
	}).then(response => {
		var ret = response.data;
		if (typeof ret === 'string') {
			var reg = /^\w+\(({[^()]+})\)$/
			var mathes = ret.match(reg)
			if (mathes) {
				ret = JSON.parse(mathes[1])
			}
		}
		res.json(ret)
	}).catch(e => {
		console.log(e)
	})
})

// 获取排行榜数据
apiRoutes.get('/toplist', (req, res) => {
	var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
	axios.get(url, {
		headers: {
			referer: "https://c.y.qq.com/",
			host: 'c.y.qq.com'
		},
		params: req.query
	}).then(response => {
		var ret = response.data;
		if (typeof ret === 'string') {
			// 这接口真特么恶心
			ret = JSON.parse((ret.replace(/MusicJsonCallback\((.*)\)/, '$1')).match(/\{(.|\n)*\}/)[0])
		}
		res.json(ret)
	}).catch(e => {
		console.log(e)
	})
})

//获取vkey
apiRoutes.get('/getMusic', (req, res) => {
	var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
	axios.get(url, {
		headers: {
			referer: "https://c.y.qq.com/",
			host: 'c.y.qq.com'
		},
		params: req.query
	}).then(response => {
		res.json(response.data)
	}).catch(e => {
		console.log(e)
	})
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})
