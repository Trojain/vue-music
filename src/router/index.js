import Vue from 'vue'
import Router from 'vue-router'

// vue路由同步加载   首屏加载慢
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

Vue.use(Router)

// vue路由懒加载  异步加载
const Recommend = (resolve) => {
	import ('components/recommend/recommend').then((module) => {
		resolve(module)
	})
}
const Singer = (resolve) => {
	import ('components/singer/singer').then((module) => {
		resolve(module)
	})
}
const SingerDetail = (resolve) => {
	import ('components/singer-detail/singer-detail').then((module) => {
		resolve(module)
	})
}
const Rank = (resolve) => {
	import ('components/rank/rank').then((module) => {
		resolve(module)
	})
}
const Search = (resolve) => {
	import ('components/search/search').then((module) => {
		resolve(module)
	})
}
const Disc = (resolve) => {
	import ('components/disc/disc').then((module) => {
		resolve(module)
	})
}
const TopList = (resolve) => {
	import ('components/top-list/top-list').then((module) => {
		resolve(module)
	})
}
const UserCenter = (resolve) => {
	import ('components/user-center/user-center').then((module) => {
		resolve(module)
	})
}



export default new Router({
	routes: [{
		// 访问根目录时重定向到 recommend 组件
		path: '/',
		redirect: '/recommend'
	}, {
		path: '/user',
		name: 'UserCenter',
		component: UserCenter, // 用户中心
	}, {
		path: '/recommend',
		name: 'recommend',
		component: Recommend,
		// 子路由
		children: [{
			path: ':id', // 传参 歌单id
			component: Disc // 推荐歌单详情页
		}]
	}, {
		path: '/singer',
		name: 'singer',
		component: Singer,
		// 子路由
		children: [{
			path: ':id', // 传参
			component: SingerDetail // 歌手详情组件
		}]
	}, {
		path: '/rank',
		name: 'rank',
		component: Rank,
		// 子路由
		children: [{
			path: ':id', // 传参 排行榜id
			component: TopList // 排行详情组件
		}]
	}, {
		path: '/search',
		name: 'search',
		component: Search,
		// 子路由
		children: [{
			path: ':id', // 传参 搜索id
			component: SingerDetail // 歌手详情组件
		}]
	}]
})
