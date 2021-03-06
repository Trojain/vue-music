<!-- 播放器组件 -->
<template>
	<div class="player" v-show="playList.length>0">
		<!-- vue提供的动画钩子 enter、after-enter、leave、after-leave -->
		<transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
			<!-- 展开的播放器 start -->
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdCls">
								<img class="image" :src="currentSong.image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">{{playingLyric}}</div>
						</div>
					</div>

					<!-- 歌词部分 start -->
					<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
							</div>
						</div>
					</scroll>
					<!-- 歌词部分 end -->

				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active':currentShow==='cd'}"></span>
						<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<!-- 播放模式 -->
						<div class="icon i-left" @click="changeMode">
							<i :class="iconMode"></i>
						</div>
						<!-- 上一首歌 -->
						<div class="icon i-left" :class="disableCls">
							<i @click="prev" class="icon-prev"></i>
						</div>
						<!-- 播放暂停 -->
						<div class="icon i-center" :class="disableCls">
							<i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<!-- 下一首歌 -->
						<div class="icon i-right" :class="disableCls">
							<i @click="next" class="icon-next"></i>
						</div>
						<!-- 收藏 -->
						<div class="icon i-right">
							<i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- 展开的播放器 end-->

		<!-- 收起的播放器 start -->
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :class="cdCls" width="40" height="40" :src="currentSong.image">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<progress-circle :radius="radius" :percent="percent">
						<i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlaylist">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<!-- 收起的播放器 end-->
		<playlist ref="playlist"></playlist>
		<audio ref="audio" id="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end">
			<!-- <source src="http://dl.stream.qqmusic.qq.com/C4000039MnYb0qxYhV.m4a?vkey=186D87963D7E6B74892630DEA7287C565B3051B55C90D1AC9A0E18843CE0CD855EC34ED10A78EE1D2D93DD3CCE895039713235A3C00B1D4C&guid=6217354311&uin=0&fromtag=38"> -->
			<source :src="vkey">
		</audio>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation"; // css3动画插件
import { prefixStyle } from "common/js/dom";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
import Lyric from "lyric-parser"; // 歌词解析的三方库
import Scroll from "base/scroll/scroll";
import { playerMixin } from "common/js/mixin";
import Playlist from "components/playlist/playlist";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
    mixins: [playerMixin],
    data() {
        return {
            songReady: false,
            currentTime: 0, // 歌曲播放时间
            radius: 32,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: "cd",
            playingLyric: ""
        };
    },
    computed: {
        vkeyUrl() {
            var url = `http://dl.stream.qqmusic.qq.com/C400${
                this.currentSong.mid
            }.m4a?vkey=${this.vkey}&guid=6217354311&uin=0&fromtag=38`;
            // var url;
            // if (this.vkey) {
            //     url = `http://dl.stream.qqmusic.qq.com/C400${
            //         this.currentSong.mid
            //     }.m4a?vkey=${this.vkey}&guid=6217354311&uin=0&fromtag=38`;
            // } else {
            //     url = "";
            // }
            return url;
        },
        cdCls() {
            return this.playing ? "play" : "play pause";
        },
        playIcon() {
            return this.playing ? "icon-pause" : "icon-play";
        },
        miniIcon() {
            return this.playing ? "icon-pause-mini" : "icon-play-mini";
        },
        disableCls() {
            return this.songReady ? "" : "disable";
        },
        // 当前歌曲进度百分比
        percent() {
            // 当前时间除以总时长
            return this.currentTime / this.currentSong.duration;
        },
        ...mapGetters([
            "vkey",
            "fullScreen",
            "playList",
            "currentSong",
            "playing",
            "currentIndex",
            "mode",
            "sequenceList"
        ])
    },
    created() {
        this.touch = {};
    },
    methods: {
        ...mapMutations({
            setFullScreen: "SET_FULL_SCREEN" //是否全屏

            // 由mixins:playerMixin引入公用部分

            // setPlayingState: "SET_PLAYING_STATE", //是否播放
            // setCurrentIndex: "SET_CURRENT_INDEX", //当前播放的歌曲索引
            // setPlayMode: "SET_MODE", // 歌曲模式
            // setPlayList: "SET_PLAYLIST" // 歌曲播放列表
        }),
        ...mapActions(["savePlayHistory"]),
        back() {
            // this.fullScreen = false; 不能直接修改actions里的属性
            this.setFullScreen(false); // 通过mapMutations修改
        },
        open() {
            this.setFullScreen(true);
        },

        // 动画钩子函数 start
        enter(el, done) {
            const { x, y, scale } = this._getPosAndScale();
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            };
            // css3动画插件
            // 注册动画
            animations.registerAnimation({
                name: "move",
                animation,
                presets: {
                    duration: 400,
                    easing: "linear"
                }
            });
            // 运行animations
            animations.runAnimation(this.$refs.cdWrapper, "move", done);
        },
        afterEnter() {
            // 清空animation 解除动画
            animations.unregisterAnimation("move");
            this.$refs.cdWrapper.style.animation = "";
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = "all 0.4s";
            const { x, y, scale } = this._getPosAndScale();
            this.$refs.cdWrapper.style[
                transform
            ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
            this.$refs.cdWrapper.addEventListener("transitionend", done);
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = "";
            this.$refs.cdWrapper.style[transform] = "";
        },
        // 动画钩子函数 end

        togglePlaying() {
            if (!this.songReady) {
                return;
            }
            this.setPlayingState(!this.playing); // 通过mapMutations修改播放状态
            if (this.currentLyric) {
                this.currentLyric.togglePlay();
            }
        },
        // 下一首歌
        next() {
            // 歌曲加载完成后才能切换
            if (!this.songReady) {
                return;
            }
            // if (this.playList.length === 1) {
            //     this.loop();
            //     return;
            // } else {
            let index = this.currentIndex + 1;
            if (index === this.playList.length) {
                index = 0;
            }
            //提交mutation修改vuex中当前播放的歌曲索引
            this.setCurrentIndex(index);
            if (!this.playing) {
                this.togglePlaying();
            }
            // }
            this.songReady = false;
        },
        // 上一首歌
        prev() {
            // 歌曲加载完成后才能切换
            if (!this.songReady) {
                return;
            }
            if (this.playList.length === 1) {
                this.loop();
                return;
            } else {
                // let index = this.currentIndex - 1;
                // if (index === -1) {
                //     index = this.playList.length - 1;
                // }

                let index = this.currentIndex + 1;
                if (index === this.playList.length) {
                    index = 0;
                }

                //提交mutation修改vuex中当前播放的歌曲索引
                this.setCurrentIndex(index);
                if (!this.playing) {
                    this.togglePlaying();
                }
            }
            this.songReady = false;
        },
        // 歌曲播放完后的回调
        end() {
            if (this.mode === playMode.loop) {
                this.loop();
            } else {
                this.next();
            }
        },
        // 重新播放  单曲循环
        loop() {
            // 当前播放时间设置成0即可实现重新播放
            this.$refs.audio.currentTime = 0;
            this.$refs.audio.play();
            this.setPlayingState(true);
            if (this.currentLyric) {
                this.currentLyric.seek(0);
            }
        },
        // 歌曲加载完成后的回调
        ready() {
            this.songReady = true;
            this.savePlayHistory(this.currentSong);
        },
        // 歌曲加载出错的回调(无网络、加载失败...)
        error() {
            this.songReady = true;
        },
        // 获取当前播放时间进度
        updateTime(e) {
            //e.target.currentTime是audio原生事件属性(可读写，获取或设置进度)
            this.currentTime = e.target.currentTime;
        },
        //  播放音乐时间转换成分秒
        format(interval) {
            interval = interval | 0;
            const minute = (interval / 60) | 0; //分   去整数部分
            const second = this._pad(interval % 60); //秒  取余数
            return `${minute}:${second}`;
        },
        // 不足2位补0
        _pad(num, n = 2) {
            let len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        },
        // 改变播放模式  用mixins引入
        // changeMode() {
        //     const mode = (this.mode + 1) % 3;
        //     this.setPlayMode(mode);
        //     let list = null;
        //     if (mode === playMode.random) {
        //         //随机播放
        //         list = shuffle(this.sequenceList);
        //     } else {
        //         list = this.sequenceList;
        //     }
        //     this.resetCurrentIndex(list);
        //     this.setPlayList(list);
        // },
        // 改变播放模式后不更改当前播放歌曲
        // resetCurrentIndex(list) {
        //     let index = list.findIndex(item => {
        //         return item.id === this.currentSong.id;
        //     });
        //     this.setCurrentIndex(index);
        // },
        onProgressBarChange(percent) {
            const currentTime = this.currentSong.duration * percent;
            this.$refs.audio.currentTime = currentTime;
            if (!this.playing) {
                this.togglePlaying();
            }
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000);
            }
        },
        // 获取歌词
        getLyric() {
            console.log("获取歌词");
            this.currentSong
                .getLyric()
                .then(lyric => {
                    if (this.currentSong.lyric !== lyric) {
                        return;
                    }
                    this.currentLyric = new Lyric(lyric, this.handleLyric); // 解析歌词的三方库
                    console.log(this.currentLyric);
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                })
                .catch(() => {
                    this.currentLyric = null;
                    this.playingLyric = "";
                    this.currentLineNum = 0;
                });
        },
        // 歌词每行发生改变的时候触发的回调
        handleLyric({ lineNum, txt }) {
            this.currentLineNum = lineNum; // 当前歌词所在的行
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5];
                this.$refs.lyricList.scrollToElement(lineEl, 1000);
            } else {
                this.$refs.lyricList.scrollTo(0, 0, 1000);
            }
            this.playingLyric = txt;
        },
        // 显示歌曲列表组件
        showPlaylist() {
            this.$refs.playlist.show();
        },
        middleTouchStart(e) {
            this.touch.initiated = true;
            // 用来判断是否是一次移动
            this.touch.moved = false;
            const touch = e.touches[0];
            this.touch.startX = touch.pageX;
            this.touch.startY = touch.pageY;
        },
        middleTouchMove(e) {
            if (!this.touch.initiated) {
                return;
            }
            const touch = e.touches[0];
            const deltaX = touch.pageX - this.touch.startX;
            const deltaY = touch.pageY - this.touch.startY;
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return;
            }
            if (!this.touch.moved) {
                this.touch.moved = true;
            }
            const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
            const offsetWidth = Math.min(
                0,
                Math.max(-window.innerWidth, left + deltaX)
            );
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
            this.$refs.lyricList.$el.style[
                transform
            ] = `translate3d(${offsetWidth}px,0,0)`;
            this.$refs.lyricList.$el.style[transitionDuration] = 0;
            this.$refs.middleL.style.opacity = 1 - this.touch.percent;
            this.$refs.middleL.style[transitionDuration] = 0;
        },
        middleTouchEnd() {
            if (!this.touch.moved) {
                return;
            }
            let offsetWidth;
            let opacity;
            if (this.currentShow === "cd") {
                if (this.touch.percent > 0.1) {
                    offsetWidth = -window.innerWidth;
                    opacity = 0;
                    this.currentShow = "lyric";
                } else {
                    offsetWidth = 0;
                    opacity = 1;
                }
            } else {
                if (this.touch.percent < 0.9) {
                    offsetWidth = 0;
                    this.currentShow = "cd";
                    opacity = 1;
                } else {
                    offsetWidth = -window.innerWidth;
                    opacity = 0;
                }
            }
            const time = 300;
            this.$refs.lyricList.$el.style[
                transform
            ] = `translate3d(${offsetWidth}px,0,0)`;
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
            this.$refs.middleL.style.opacity = opacity;
            this.$refs.middleL.style[transitionDuration] = `${time}ms`;
            this.touch.initiated = false;
        },
        // 偏移和缩放大小
        _getPosAndScale() {
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            const x = -(window.innerWidth / 2 - paddingLeft);
            const y =
                window.innerHeight - paddingTop - width / 2 - paddingBottom;
            return {
                x,
                y,
                scale
            };
        }
    },
    watch: {
        vkey() {
            // this.$nextTick(() => {
            //     this.$refs.audio.play();
            //     console.log(1);
            // });
            // setTimeout(() => {
            //     _this.$refs.audio.play();
            //     console.log(2);
            // }, 1500);
        },
        currentSong(newSong, oldSong) {
            if (!newSong.id) {
                return;
            }
            if (newSong.id === oldSong.id) {
                return;
            }
            // this.$nextTick(() => {
            //     this.$refs.audio.play();
            //     this.getLyric();
            // });
            if (this.currentLyric) {
                this.currentLyric.stop();
                this.currentTime = 0;
                this.playingLyric = "";
                this.currentLineNum = 0;
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // 播放音乐
                this.$refs.audio.play();
				this.getLyric();
				console.log(1)
            }, 1000);
        },
        // 监听是否在播放
        playing(newPlaying) {
            const audio = this.$refs.audio;
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause();
            });
        },
        fullScreen(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.$refs.lyricList.refresh();
                }, 20);
            }
        }
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll,
        Playlist
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.player
	.normal-player
		position fixed
		left 0
		right 0
		top 0
		bottom 0
		z-index 150
		background $color-background
		.background
			position absolute
			left 0
			top 0
			width 100%
			height 100%
			z-index -1
			opacity 0.6
			filter blur(20px)
		.top
			position relative
			margin-bottom 25px
			.back
				position absolute
				top 0
				left 6px
				z-index 50
				.icon-back
					display block
					padding 9px
					font-size $font-size-large-x
					color $color-theme
					transform rotate(-90deg)
			.title
				width 70%
				margin 0 auto
				line-height 40px
				text-align center
				no-wrap()
				font-size $font-size-large
				color $color-text
			.subtitle
				line-height 20px
				text-align center
				font-size $font-size-medium
				color $color-text
		.middle
			position fixed
			width 100%
			top 80px
			bottom 170px
			white-space nowrap
			font-size 0
			.middle-l
				display inline-block
				vertical-align top
				position relative
				width 100%
				height 0
				padding-top 80%
				.cd-wrapper
					position absolute
					left 10%
					top 0
					width 80%
					height 100%
					.cd
						width 100%
						height 100%
						box-sizing border-box
						border 10px solid rgba(255, 255, 255, 0.1)
						border-radius 50%
						&.play
							animation rotate 20s linear infinite
						&.pause
							animation-play-state paused
						.image
							position absolute
							left 0
							top 0
							width 100%
							height 100%
							border-radius 50%
				.playing-lyric-wrapper
					width 80%
					margin 30px auto 0 auto
					overflow hidden
					text-align center
					.playing-lyric
						height 20px
						line-height 20px
						font-size $font-size-medium
						color $color-text-l
			.middle-r
				display inline-block
				vertical-align top
				width 100%
				height 100%
				overflow hidden
				.lyric-wrapper
					width 80%
					margin 0 auto
					overflow hidden
					text-align center
					.text
						line-height 32px
						color $color-text-l
						font-size $font-size-medium
						&.current
							color $color-text
		.bottom
			position absolute
			bottom 50px
			width 100%
			.dot-wrapper
				text-align center
				font-size 0
				.dot
					display inline-block
					vertical-align middle
					margin 0 4px
					width 8px
					height 8px
					border-radius 50%
					background $color-text-l
					&.active
						width 20px
						border-radius 5px
						background $color-text-ll
			.progress-wrapper
				display flex
				align-items center
				width 80%
				margin 0px auto
				padding 10px 0
				.time
					color $color-text
					font-size $font-size-small
					flex 0 0 30px
					line-height 30px
					width 30px
					&.time-l
						text-align left
					&.time-r
						text-align right
				.progress-bar-wrapper
					flex 1
			.operators
				display flex
				align-items center
				.icon
					flex 1
					color $color-theme
					&.disable
						color $color-theme-d
					i
						font-size 30px
				.i-left
					text-align right
				.i-center
					padding 0 20px
					text-align center
					i
						font-size 40px
				.i-right
					text-align left
				.icon-favorite
					color $color-sub-theme
		&.normal-enter-active, &.normal-leave-active
			transition all 0.4s
			.top, .bottom
				transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
		&.normal-enter, &.normal-leave-to
			opacity 0
			.top
				transform translate3d(0, -100px, 0)
			.bottom
				transform translate3d(0, 100px, 0)
	.mini-player
		display flex
		align-items center
		position fixed
		left 0
		bottom 0
		z-index 180
		width 100%
		height 60px
		background $color-highlight-background
		&.mini-enter-active, &.mini-leave-active
			transition all 0.4s
		&.mini-enter, &.mini-leave-to
			opacity 0
		.icon
			flex 0 0 40px
			width 40px
			padding 0 10px 0 20px
			img
				border-radius 50%
				&.play
					animation rotate 10s linear infinite
				&.pause
					animation-play-state paused
		.text
			display flex
			flex-direction column
			justify-content center
			flex 1
			line-height 20px
			overflow hidden
			.name
				margin-bottom 2px
				no-wrap()
				font-size $font-size-medium
				color $color-text
			.desc
				no-wrap()
				font-size $font-size-small
				color $color-text-d
		.control
			flex 0 0 30px
			width 30px
			padding 0 10px
			.icon-play-mini, .icon-pause-mini, .icon-playlist
				font-size 30px
				color $color-theme-d
			.icon-mini
				font-size 32px
				position absolute
				left 0
				top 0
@keyframes rotate
	0%
		transform rotate(0)
	100%
		transform rotate(360deg)
</style>
