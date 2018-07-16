## 项目树
```
.
├── README.md
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── index.html
├── package.json
├── prod.server.js
├── src
│   ├── App.vue  // 根组件
│   ├── api  // 存放后端请求代码(包括ajax,jsonp)  用jsonp抓QQ音乐线上数据
│   │   ├── config.js  // 公用参数配置(包括jsonp的公用参数)
│   │   ├── rank.js  // 获取排行榜和排行榜详情数据接口
│   │   ├── recommend.js  // 获取推荐歌单数据接口
│   │   ├── search.js  // 获取热门搜索数据接口
│   │   ├── singer.js    // 获取歌手数据接口
│   │   └── song.js  // 获取线上歌词数据接口
│   ├── base  // 存放基础组件(包括轮播图、loading)
│   │   ├── confirm  // 弹窗组件
│   │   │   └── confirm.vue
│   │   ├── listview  // 歌手滚动组件
│   │   │   └── listview.vue
│   │   ├── loading  // loading加载中组件
│   │   │   ├── loading.gif
│   │   │   └── loading.vue
│   │   ├── no-result  // 暂无数据组件
│   │   │   ├── no-result.vue
│   │   │   ├── no-result@2x.png
│   │   │   └── no-result@3x.png
│   │   ├── progress-bar  // 歌曲进度条组件
│   │   │   └── progress-bar.vue
│   │   ├── progress-circle  // 迷你窗口的圆形进度条组件
│   │   │   └── progress-circle.vue
│   │   ├── scroll  // better-scroll滚动组件
│   │   │   └── scroll.vue
│   │   ├── search-box  // 搜索框组件
│   │   │   └── search-box.vue
│   │   ├── search-list  // 搜索列表组件
│   │   │   └── search-list.vue
│   │   ├── slider  // 轮播图组件
│   │   │   └── slider.vue
│   │   ├── song-list  // 歌手列表组件
│   │   │   ├── first@2x.png
│   │   │   ├── first@3x.png
│   │   │   ├── second@2x.png
│   │   │   ├── second@3x.png
│   │   │   ├── song-list.vue
│   │   │   ├── third@2x.png
│   │   │   └── third@3x.png
│   │   ├── switches  // switch切换开关组件
│   │   │   └── switches.vue
│   │   └── top-tip  // 顶部提示组件
│   │       └── top-tip.vue
│   ├── common	// 存放通用的静态资源(包括字体、图片、公用js、公用css)
│   │   ├── fonts  // 字体
│   │   │   ├── music-icon.eot
│   │   │   ├── music-icon.svg
│   │   │   ├── music-icon.ttf
│   │   │   └── music-icon.woff
│   │   ├── image  // 图片
│   │   │   └── default.png
│   │   ├── js  // 公用js
│   │   │   ├── cache.js  // 缓存数据(引入good-storage的第三方库)
│   │   │   ├── config.js  // 播放模式的配置
│   │   │   ├── dom.js	// 通用dom操作
│   │   │   ├── jsonp.js	// 用Promise封装jsonp
│   │   │   ├── mixin.js  // 共享组件之间的js逻辑
│   │   │   ├── singer.js  // 歌手数据封装成类
│   │   │   ├── song.js  // 歌手详情数据封装成类
│   │   │   └── util.js  // 随机播放
│   │   └── stylus  // 公用css
│   │       ├── base.styl  // body, html初始化样式
│   │       ├── icon.styl  // 字体图标样式
│   │       ├── index.styl  //引入 reset.styl、base.styl、icon.styl 总出口
│   │       ├── mixin.styl  // 样式方法
│   │       ├── reset.styl  // 样式清零
│   │       └── variable.styl  // 定义公用颜色和字体规范
│   ├── components	// 存放业务组件(包含所有的业务逻辑)
│   │   ├── add-song  // 添加歌曲到列表
│   │   │   └── add-song.vue
│   │   ├── disc  // 推荐歌单详情页
│   │   │   └── disc.vue
│   │   ├── m-header  // 头部组件
│   │   │   ├── logo@2x.png
│   │   │   ├── logo@3x.png
│   │   │   └── m-header.vue
│   │   ├── music-list  // 音乐详情页面
│   │   │   └── music-list.vue
│   │   ├── player  // 播放器组件
│   │   │   └── player.vue
│   │   ├── playlist  // 歌曲列表
│   │   │   └── playlist.vue
│   │   ├── rank  // 排行页
│   │   │   └── rank.vue
│   │   ├── recommend  // 推荐页
│   │   │   └── recommend.vue
│   │   ├── search  // 搜索页
│   │   │   └── search.vue
│   │   ├── singer  // 歌手页
│   │   │   └── singer.vue
│   │   ├── singer-detail  // 歌手详情页
│   │   │   └── singer-detail.vue
│   │   ├── suggest  // 搜索列表
│   │   │   └── suggest.vue
│   │   ├── tab  // 导航栏
│   │   │   └── tab.vue
│   │   ├── top-list  // 排行详情页
│   │   │   └── top-list.vue
│   │   └── user-center  // 用户中心页
│   │       └── user-center.vue
│   ├── main.js  // 主入口文件
│   ├── router	// 路由配置
│   │   └── index.js
│   └── store	// vuex
│       ├── actions.js // 异步操作和提交多个mutation
│       ├── getters.js // 将store中的getters映射到局部计算属性中
│       ├── index.js // 入口
│       ├── mutation-types.js  // 存储mutation相关的字符串常量(省略)
│       ├── mutations.js   // 改变state状态
│       └── state.js // 状态
└── static  // 空


```

----
## 项目运行方式
```
1.npm install

2.npm run dev
	
```

----
## 对vue-cli的修改
```
1.新增依赖包:
	"dependencies": {
		"axios": "^0.18.0",
		"vuex": "^3.0.1",
		"babel-runtime": "^6.0.0",
		"fastclick": "^1.0.6",
		"vue-lazyload": "1.0.3",
		"jsonp": "0.2.1",
		"better-scroll": "^0.1.15",
		"create-keyframe-animation": "^0.1.0",
		"js-base64": "^2.1.9",
		"lyric-parser": "^1.0.1",
		"good-storage": "^1.0.1"
	},
	"devDependencies": {
		"babel-polyfill": "^6.26.0",
	}

	
2.修改build/webpack.base.conf.js:

  resolve: {
	extensions: ['.js', '.vue', '.json'],
	alias: {
		'vue$': 'vue/dist/vue.esm.js',
		'@': resolve('src'),
		'common': resolve('src/common'),  // 新增common别名配置 (例如：import 'common/stylus/index.styl')
		'components': resolve('src/components'),
		'api': resolve('src/api'),
		'base': resolve('src/base')
	}
  }
  
  
3.修改build/webpack.dev.conf.js:
	
	#通过后端代理的方式请求接口
  
	因为最新的vue里dev-server.js被替换成了webpack-dev-conf.js
	在模拟后台数据的时候直接在webpack-dev-conf.js文件中修改

	第一步，在const portfinder = require(‘portfinder’)后添加
	
		const axios = require('axios')
		const express = require('express')
		var apiRoutes = express.Router()
		
		
	第二步找到devServer,在里面添加   使用后端代理
	
		before(apiRoutes) {
			// 获取歌单
			apiRoutes.get('/api/getDiscList', (req, res) => {
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
			}),

			// 获取推荐歌单
			apiRoutes.get('/api/getSongList', function (req, res) {
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
			}),

			// 获取歌词
			apiRoutes.get('/api/lyric', (req, res) => {
				var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
				axios.get(url, {
					headers: {
						referer: "https://c.y.qq.com/",
						host: 'c.y.qq.com'
					},
					params: req.query
				}).then(response => {
					var ret = response.data;
					if(typeof ret === 'string'){
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
			}),

			// 获取排行榜数据
			apiRoutes.get('/api/toplist', (req, res) => {
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
			}),

			//获取vkey
			apiRoutes.get('/api/getMusic', (req, res) => {
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
		}
  
```

----

## jsonp
```
jsonp：利用js动态创建script标签，其中src属性不受同源策略影响，因此可以跨域

github:https://github.com/webmodules/jsonp


安装方法：npm install jsonp


封装jsonp：/src/common/js/jsonp.js
```
----



