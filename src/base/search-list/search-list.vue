<!-- 搜索列表 -->
<template>
	<div class="search-list" v-show="searches.length">
		<transition-group name="list" tag="ul">
			<!-- transition-group中一定要有个key值 -->
			<li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</transition-group>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        searches: {
            type: Array,
            default: []
        }
    },
    methods: {
        // 对父组件派发一个点击事件，基础组件本身不会做业务逻辑
        selectItem(item) {
            this.$emit("select", item);
        },
        deleteOne(item) {
            this.$emit("delete", item);
        }
    }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.search-list
	.search-item
		display flex
		align-items center
		height 40px
		overflow hidden
		&.list-enter-active, &.list-leave-active
			transition all 0.1s
		&.list-enter, &.list-leave-to
			height 0
		.text
			flex 1
			color $color-text-l
		.icon
			extend-click()
			.icon-delete
				font-size $font-size-small
				color $color-text-d
</style>
