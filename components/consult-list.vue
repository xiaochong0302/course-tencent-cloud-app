<template>
	<view class="consult-list">
		<view class="consult" v-for="consult in showConsults" :key="consult.id">
			<view class="avatar">
				<u-image :src="consult.owner.avatar|thumbAvatar" width="60" height="60" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="question">{{ consult.question }}</view>
				<view class="answer">{{ consult.answer }}</view>
				<view class="bottom">
					<view class="time">{{ consult.create_time|timeFrom('yyyy-mm-dd') }}</view>
					<view class="like">
						<u-icon name="thumb-up" :label="consult.like_count"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ConsultList',
		data() {
			return {
				showConsults: []
			}
		},
		props: {
			consults: {
				type: Array
			}
		},
		created() {
			this.showConsults = this.consults
		},
		watch: {
			consults: function() {
				this.showConsults = this.consults
			}
		},
		methods: {
			gotoConsult(id) {
				this.$utils.redirect(`/pages/consult/info?id=${id}`)
			}
		}
	}
</script>

<style>
	.consult {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.consult .avatar {
		width: 60rpx;
		height: 60rpx;
	}
	
	.consult .info {
		flex: 1;
	}
	
	.consult .avatar {
		margin-right: 15rpx;
	}
	
	.consult .question {
		margin-bottom: 15rpx;
	}
	
	.consult .answer {
		margin-bottom: 15rpx;
	}
	
	.consult .bottom {
		display: flex;
		justify-content: space-between;
	}
</style>
