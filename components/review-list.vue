<template>
	<view class="review-list">
		<view class="review" v-for="review in showReviews" :key="review.id">
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
			reviews: {
				type: Array
			}
		},
		created() {
			this.showReviews = this.reviews
		},
		watch: {
			reviews: function() {
				this.showReviews = this.reviews
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
	.review {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.review .avatar {
		width: 60rpx;
		height: 60rpx;
	}
	
	.review .info {
		flex: 1;
	}
	
	.review .avatar {
		margin-right: 15rpx;
	}
	
	.review .top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}
	
	.review .bottom {
		display: flex;
		justify-content: space-between;
	}
	
	.review .content {
		margin-bottom: 15rpx;
	}
</style>
