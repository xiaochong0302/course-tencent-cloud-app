<template>
	<view class="item-list">
		<view class="item" v-for="live in lives" :key="live.chapter.id" @click="gotoLive(live.chapter.id)">
			<view class="avatar">
				<u-image :src="live.course.teacher.avatar|thumbCover" width="120" height="120" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="title u-m-b-10">{{ live.chapter.title }}</view>
				<view class="meta u-m-b-10">
					<text>主讲：{{ live.course.teacher.name }}</text>
					<text>{{ live.course.teacher.title }}</text>
				</view>
				<view class="meta">
					<text>时间：{{ live.start_time|timeFormat('mm月dd日 hh:MM') }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'LiveList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				lives: []
			}
		},
		created() {
			this.lives = this.items
		},
		watch: {
			items: function() {
				this.lives = this.items
			}
		},
		methods: {
			gotoLive(id) {
				this.$utils.redirect('/pages/chapter/live', {
					id: id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.item .avatar {
		margin-right: 20rpx;
	}
	
	.item .info {
		flex: 1;
	}

	.item .title {
		color: $u-main-color;
	}
	
	.item .meta {
		color: $u-tips-color;
	}
	
	.meta text {
		margin-right: 15rpx;
	}
</style>
