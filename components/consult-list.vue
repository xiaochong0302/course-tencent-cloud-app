<template>
	<view class="item-list">
		<view class="item" v-for="(consult,index) in consults" :key="consult.id">
			<view class="avatar" @click="gotoUser(consult.owner.id)">
				<u-image :src="consult.owner.avatar|thumbAvatar" width="60" height="60" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="owner">{{ consult.owner.name }}</view>
				<view class="content" @click="gotoConsult(consult.id)">
					<view class="question">{{ consult.question }}</view>
					<view class="answer">{{ consult.answer }}</view>
				</view>
				<view class="bottom">
					<view class="time">{{ consult.create_time|timeFrom('yyyy-mm-dd') }}</view>
					<view class="like">
						<u-icon :name="consult.like_icon.name" :color="consult.like_icon.color" :label="consult.like_count" :index="index"
						 @click="like"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		name: 'ConsultList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				consults: []
			}
		},
		created() {
			this.consults = this.initConsults(this.items)
		},
		watch: {
			items: function() {
				this.consults = this.initConsults(this.items)
			}
		},
		methods: {
			like(index) {
				let id = this.items[index].id
				this.$api.likeConsult(id).then(res => {
					if (this.consults[index].liked) {
						this.consults[index].like_icon = {
							name: 'thumb-up',
							color: ''
						}
						this.consults[index].like_count--
						this.consults[index].liked = false
					} else {
						this.consults[index].like_icon = {
							name: 'thumb-up-fill',
							color: 'red'
						}
						this.consults[index].like_count++
						this.consults[index].liked = true
					}
				}).catch(e => {
					this.$u.toast(e.msg)
				})
				return false
			},
			stopEvent() {
				console.log('stop')
			},
			gotoUser(id) {
				this.$utils.redirect('/pages/user/index', {
					id: id
				})
			},
			gotoConsult(id) {
				this.$utils.redirect('/pages/consult/info', {
					id: id
				})
			},
			initConsults(consults) {
				let result = []
				consults.map(consult => {
					result.push({
						id: consult.id,
						question: consult.question,
						answer: consult.answer,
						create_time: consult.create_time,
						like_count: consult.like_count,
						like_icon: {
							name: 'thumb-up',
							color: ''
						},
						liked: false,
						owner: consult.owner,
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
	
	.item .owner {
		color: #366092;
		margin-bottom: 15rpx;
	}

	.item .content {
		color: $u-content-color;
	}

	.item .question {
		margin-bottom: 15rpx;
	}

	.item .answer {
		margin-bottom: 15rpx;
	}

	.item .bottom {
		display: flex;
		justify-content: space-between;
		color: $u-tips-color;
	}
</style>
