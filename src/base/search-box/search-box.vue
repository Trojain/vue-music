<!-- 搜索框组件 -->
<template>
	<div class="search-box">
		<i class="icon-search"></i>
		<input ref="query" v-model="query" class="box" :placeholder="placeholder" />
		<i @click="clear" v-show="query" class="icon-dismiss"></i>
	</div>
</template>

<script type="text/ecmascript-6">
import { debounce } from "common/js/util";

export default {
    props: {
        placeholder: {
            type: String,
            default: "搜索歌曲、歌手"
        }
    },
    data() {
        return {
            query: ""
        };
    },
    methods: {
        clear() {
            this.query = "";
        },
        // 将方法暴露给父组件，给父组件调用
        setQuery(query) {
            // 获取父组件传过来的值
            this.query = query;
        },
        //对外的方法  由search.vue调用
        blur() {
            // 搜索框失去焦点 移动端收起键盘
            this.$refs.query.blur();
        }
    },
    created() {
        // 钩子中监听回调
        this.$watch(
            "query",
            // 截流  不会多次触发
            debounce(newQuery => {
                // 监听输入框的值并传给父组件
                this.$emit("query", newQuery);
            }, 200)
        );
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.search-box
	display flex
	align-items center
	box-sizing border-box
	width 100%
	padding 0 6px
	height 40px
	background $color-highlight-background
	border-radius 6px
	.icon-search
		font-size 24px
		color $color-background
	.box
		flex 1
		margin 0 5px
		line-height 18px
		background $color-highlight-background
		color $color-text
		font-size $font-size-medium
		&::placeholder
			color $color-text-d
	.icon-dismiss
		font-size 16px
		color $color-background
</style>
