<!-- 推荐歌单详情页 -->
<!-- recommend的子路由 -->
<template>
	<transition name="slide">
		<!-- 与歌手详情用的是同一个组件 -->
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { mapGetters } from "vuex";
import { createSong } from "common/js/song";

export default {
    computed: {
        title() {
            return this.disc.dissname;
        },
        bgImage() {
            return this.disc.imgurl;
        },
        ...mapGetters(["disc"])
    },
    data() {
        return {
            songs: []
        };
    },
    created() {
        this._getSongList();
    },
    methods: {
        _getSongList() {
            // 没有dissid(刷新页面)则回退到推荐页面
            if (!this.disc.dissid) {
                this.$router.push("/recommend");
                return;
            }
            getSongList(this.disc.dissid).then(res => {
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.cdlist[0].songlist);
                }
            });
        },
        _normalizeSongs(list) {
            let ret = [];
            list.forEach(musicData => {
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
.slide-enter-active, .slide-leave-active
	transition all 0.3s
.slide-enter, .slide-leave-to
	transform translate3d(100%, 0, 0)
</style>
