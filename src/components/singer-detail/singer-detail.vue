<!-- 歌手子组件 —— 歌手详情 -->
<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
	<!-- <transition name="slide">
		<div class="singer-detail"></div>
	</transition> -->
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import { mapGetters } from "vuex";

export default {
    computed: {
        title() {
            return this.singer.name;
        },
        bgImage() {
            return this.singer.avatar;
        },
        // 用vuex读取数据(读取的是getters.js中的数据)
        // 相当于this.$store.getters.singer(vuex语法糖)
        ...mapGetters(["singer"])
    },
    data() {
        return {
            songs: []
        };
    },
    created() {
        this._getDetail();
        // 用vuex读取数据(读取的是getters.js中的数据)
        // 相当于this.$store.getters.singer(vuex语法糖)
        console.log(this.singer);
    },
    methods: {
        _getDetail() {
            // 获取不到歌手详情则回退到父组件singer
            if (!this.singer.id) {
                this.$router.push("/singer");
                return;
            }
            getSingerDetail(this.singer.id).then(res => {
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.data.list);
                }
            });
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(item => {
                // 对象解构赋值
                let { musicData } = item;
                if (musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData));
                }
			});
            return ret;
        }
    },
    components: {
        MusicList
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.singer-detail
	position fixed
	z-index 100
	top 0
	left 0
	right 0
	bottom 0
	background $color-background
.slide-enter-active, .slide-leave-active
	transition all 0.3s
.slide-enter, .slide-leave-to
	transform translate3d(100%, 0, 0)
</style>
