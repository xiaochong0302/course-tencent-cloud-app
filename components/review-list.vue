<template>
	<view class="item-list">
		<view class="item" v-for="(review,index) in reviews" :key="review.id">
			<view class="avatar" @click="gotoUser(review.owner.id)">
				<u-image :src="review.owner.avatar|thumbAvatar" width="60" height="60" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="top">
					<view class="owner" @click="gotoUser(review.owner.id)">{{ review.owner.name }}</view>
					<view class="rating">
						<u-rate :current="review.rating" size="28" :disabled="true"></u-rate>
					</view>
				</view>
				<view class="content" @click="gotoReview(review.id)">{{ review.content }}</view>
				<view class="bottom">
					<view class="time">{{ review.create_time|timeFrom('yyyy-mm-dd') }}</view>
					<view class="like">
						<u-icon :name="review.like_icon.name" :color="review.like_icon.color" :label="review.like_count" :index="index"
						 @click="like"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ReviewList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				reviews: []
			}
		},
		created() {
			this.reviews = this.initReviews(this.items)
		},
		watch: {
			items: function() {
				this.reviews = this.initReviews(this.items)
			}
		},
		methods: {
			like(index) {
				let id = this.items[index].id
				this.$api.likeReview(id).then(res => {
					if (this.reviews[index].liked) {
						this.reviews[index].like_icon = {
							name: 'thumb-up',
							color: ''
						}
						this.reviews[index].like_count--
						this.reviews[index].liked = false
					} else {
						this.reviews[index].like_icon = {
							name: 'thumb-up-fill',
							color: 'red'
						}
						this.reviews[index].like_count++
						this.reviews[index].liked = true
					}
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			gotoUser(id) {
				this.$utils.redirect('/pages/user/index', {
					id: id
				})
			},
			gotoReview(id) {
				this.$utils.redirect('/pages/review/info', {
					id: id
				})
			},
			initReviews(reviews) {
				let result = []
				reviews.map(review => {
					result.push({
						id: review.id,
						rating: review.rating,
						content: review.content,
						create_time: review.create_time,
						like_count: review.like_count,
						like_icon: {
							name: 'thumb-up',
							color: ''
						},
						liked: false,
						owner: review.owner,
					})
				})
				return result
			}
		}
	}
</script>

<style lang="scss" scoped>
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
	
	.item .owner {
		color: #366092;
	}

	.item .content {
		color: $u-content-color;
		margin-bottom: 15rpx;
	}

	.item .bottom {
		display: flex;
		justify-content: space-between;
		color: $u-tips-color;
	}
</style>
