<template>
	<view class="container" v-if="review.id > 0">
		<view class="rating">
			<text>内容实用：</text>
			<u-rate :current="review.rating1" :disabled="true"></u-rate>
		</view>
		<view class="rating">
			<text>简洁易懂：</text>
			<u-rate :current="review.rating2" :disabled="true"></u-rate>
		</view>
		<view class="rating">
			<text>逻辑清晰：</text>
			<u-rate :current="review.rating3" :disabled="true"></u-rate>
		</view>
		<view class="content">{{ review.content }}</view>
		<view class="time">{{ review.create_time|timeFormat('yyyy-mm-dd hh:MM') }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				review: {
					course: {}
				}
			}
		},
		onLoad(e) {
			this.loadReview(e.id)
		},
		methods: {
			loadReview(id) {
				this.$api.getReviewInfo(id).then(res => {
					this.review = res.review
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 30rpx;
	}

	.title {
		font-weight: 600;
		margin-bottom: 30rpx;
	}

	.content {
		margin-bottom: 30rpx;
	}

	.rating {
		margin-bottom: 30rpx;
	}

	.time {
		margin-bottom: 30rpx;
	}
</style>
