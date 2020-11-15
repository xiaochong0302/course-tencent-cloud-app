<template>
	<view class="item-list">
		<view class="item" v-for="consult in showConsults" :key="consult.id">
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
			items: {
				type: Array
			}
		},
		created() {
			this.showConsults = this.items
		},
		watch: {
			items: function() {
				this.showConsults = this.items
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
	
	.item .question {
		margin-bottom: 15rpx;
	}
	
	.item .answer {
		margin-bottom: 15rpx;
	}
	
	.item .bottom {
		display: flex;
		justify-content: space-between;
	}
</style>
