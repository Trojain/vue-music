<!-- 2.歌手 -->
<template>
	<div class="singer" ref="singer">
		<list-view @select="selectSinger" :data="singers" ref="list"></list-view>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

export default {
    // 组件中插入外部属性  组件中的属性会覆盖mixin中的属性
    mixins: [playlistMixin],
    name: "singer",
    data() {
        return {
            singers: []
        };
    },
    components: { ListView },
    created() {
        this._getSingerList();
    },
    methods: {
        // mixins
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? "60px" : "";
			this.$refs.singer.style.bottom = bottom;
            // 调用子组件的refresh()方法
            this.$refs.list.refresh(); // 重新计算scroll 重新刷新
        },
        // 接收子组件listview传过来的数据
        selectSinger(singer) {
            // 路由跳转到子组件
            this.$router.push({
                path: `/singer/${singer.id}`
            });
            // ...mapMutations({setSinger})
            // 通过this.setSinger(singer)提交一个名为setSinger的mutation
            this.setSinger(singer); // 相当于this.$store.commit("setSinger", singer);
        },
        _getSingerList() {
            getSingerList().then(res => {
                if (res.code === ERR_OK) {
                    this.singers = this._normalizeSinger(res.data.list);
                }
            });
        },
        // 对数据进行处理
        _normalizeSinger(list) {
            // 热门数据
            let map = {
                hot: {
                    title: "热门",
                    items: []
                }
            };
            list.forEach((item, index) => {
                // 前十条为热门数据
                if (index < 10) {
                    map.hot.items.push(
                        new Singer({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid
                        })
                    );
                }

                // A-Z 聚类
                const key = item.Findex;
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    };
                }
                map[key].items.push(
                    new Singer({
                        name: item.Fsinger_name,
                        id: item.Fsinger_mid
                    })
                );
            });
            // console.log(map); // 得到一个map对象 不是数组

            // 为了得到有序列表，我们需要处理 map
            // 把map对象转换成数组(对象的遍历是无序的，数组才是有序的)
            let hot = [];
            let ret = [];
            for (let key in map) {
                let val = map[key];
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val);
                } else if (val.title === "热门") {
                    hot.push(val);
                }
            }
            // 按字母升序排序
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0);
            });
            // 把两个数组合并成一个一维数组
            return hot.concat(ret);
        },
        // 用vuex存贮数据(vuex语法糖)
        ...mapMutations({
            // 将setSinger与mutations中的SET_SINGER关联
            setSinger: "SET_SINGER"
        })
    }
};
</script>

<style lang="stylus" scoped>
.singer
	position fixed
	top 88px
	bottom 0
	width 100%
</style>
