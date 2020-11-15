<template>
	<view class="item-list">
		<view class="item" v-for="live in showLives" :key="live.chapter.id" @click="gotoLive(live.chapter.id)">
			<view class="cover">
				<u-image :src="live.course.cover|thumbCover" width="240" height="134" border-radius="10"></u-image>
			</view>
			<view class="info">
				<view class="title">{{ live.chapter.title }}</view>
				<view class="time">{{ live.start_time|timeFormat('yyyy-mm-dd hh:MM') }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'LiveList',
		data() {
			return {
				showLives: []
			}
		},
		props: {
			items: {
				type: Array
			}
		},
		created() {
			this.showLives = this.items
		},
		watch: {
			items: function() {
				this.showLives = this.items
			}
		},
		methods: {
			gotoLive(id) {
				this.$utils.redirect(`/pages/chapter/live?id=${id}`)
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.item .cover {
		width: 240rpx;
		height: 134rpx;
	}
	
	.item .info {
		flex: 1;
	}
	
	.item .cover {
		margin-right: 15rpx;
	}
	
	.item .title {
		margin-bottom: 15rpx;
	}
</style>
