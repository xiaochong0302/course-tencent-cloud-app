<template>
	<view class="item-list">
		<view class="item" v-for="review in showReviews" :key="review.id">
			<view class="avatar">
				<u-image :src="review.owner.avatar|thumbAvatar" width="60" height="60" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="top">
					<view class="name">{{ review.owner.name }}</view>
					<view class="rating">
						<u-rate size="28" :current="review.rating" :disabled="true"></u-rate>
					</view>
				</view>
				<view class="content">{{ review.content }}</view>
				<view class="bottom">
					<view class="time">{{ review.create_time|timeFrom('yyyy-mm-dd') }}</view>
					<view class="like">
						<u-icon name="thumb-up" :label="review.like_count"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ReviewList',
		data() {
			return {
				showReviews: []
			}
		},
		props: {
			items: {
				type: Array
			}
		},
		created() {
			this.showReviews = this.items
		},
		watch: {
			items: function() {
				this.showReviews = this.items
			}
		},
		methods: {
			gotoReview(id) {
				this.$utils.redirect(`/pages/review/info?id=${id}`)
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.item .avatar {
		width: 60rpx;
		height: 60rpx;
	}
	
	.item .info {
		flex: 1;
	}
	
	.item .avatar {
		margin-right: 15rpx;
	}
	
	.item .top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}
	
	.item .bottom {
		display: flex;
		justify-content: space-between;
	}
	
	.item .content {
		margin-bottom: 15rpx;
	}
</style>
