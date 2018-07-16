<!-- 1.推荐 -->
<template>
	<div class="recommend" ref="recommend">
		<scroll ref="scroll" class="recommend-content" :data="discList">
			<div>
				<div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
					<!-- 轮播图组件 -->
					<slider>
						<div v-for="(item,index) in recommends" :key="index">
							<a :href="item.linkUrl">
								<img @load="loadImage" class="needsclick" :src="item.picUrl">
							</a>
						</div>
					</slider>
				</div>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li @click="selectItem(item)" v-for="(item,index) in discList" class="item" :key="index">
							<div class="icon">
								<!-- 图片懒加载 -->
								<img width="60" height="60" v-lazy="item.imgurl">
							</div>
							<div class="text">
								<h2 class="name" v-html="item.creator.name"></h2>
								<p class="desc" v-html="item.dissname"></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="loading-container" v-show="!discList.length">
				<loading></loading>
			</div>
		</scroll>
		<!-- 二级路由 disc组件 -->
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
import Slider from "base/slider/slider";
import Loading from "base/loading/loading";
import Scroll from "base/scroll/scroll";
import { getRecommend, getDiscList } from "api/recommend";
import { playlistMixin } from "common/js/mixin";
import { ERR_OK } from "api/config";
import { mapMutations } from "vuex";

export default {
    mixins: [playlistMixin],
    data() {
        return {
            recommends: [],
            discList: []
        };
    },
    created() {
        // 获取线上数据
        this._getRecommend(); // 轮播图
        this._getDiscList(); // 推荐歌单
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? "60px" : "";
            this.$refs.recommend.style.bottom = bottom;
            this.$refs.scroll.refresh();
        },
        loadImage() {
            if (!this.checkloaded) {
                this.checkloaded = true;
                this.$refs.scroll.refresh();
            }
        },
        selectItem(item) {
            // 跳转到disc.vue子路由 传参
            console.log(item.dissid);
            this.$router.push({
                path: `/recommend/${item.dissid}`
            });
            // 将item提交到mutations
            this.setDisc(item);
        },
        _getRecommend() {
            getRecommend().then(res => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider;
                }
            });
        },
        _getDiscList() {
            getDiscList().then(res => {
                if (res.code === ERR_OK) {
                    this.discList = res.data.list;
                }
            });
        },
        ...mapMutations({
            setDisc: "SET_DISC"
        })
    },
    components: {
        Slider,
        Loading,
        Scroll
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.recommend
	position fixed
	width 100%
	top 88px
	bottom 0
	.recommend-content
		height 100%
		overflow hidden
		.slider-wrapper
			position relative
			width 100%
			overflow hidden
		.recommend-list
			.list-title
				height 65px
				line-height 65px
				text-align center
				font-size $font-size-medium
				color $color-theme
			.item
				display flex
				box-sizing border-box
				align-items center
				padding 0 20px 20px 20px
				.icon
					flex 0 0 60px
					width 60px
					padding-right 20px
				.text
					display flex
					flex-direction column
					justify-content center
					flex 1
					line-height 20px
					overflow hidden
					font-size $font-size-medium
					.name
						margin-bottom 10px
						color $color-text
					.desc
						color $color-text-d
		.loading-container
			position absolute
			width 100%
			top 50%
			transform translateY(-50%)
</style>
