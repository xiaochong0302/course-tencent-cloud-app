<template>
	<view class="item-list">
		<view class="item" v-for="group in groups" :key="group.id" @click="gotoGroup(group.id)">
			<view class="avatar">
				<u-image :src="group.avatar|thumbAvatar" width="100" height="100" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="title u-line-1">{{ group.name }}</view>
				<view class="meta">
					<text>成员：{{ group.user_count }}</text>
					<text>讨论：{{ group.msg_count }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GroupList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				groups: []
			}
		},
		created() {
			this.groups = this.items
		},
		watch: {
			items: function() {
				this.groups = this.items
			}
		},
		methods: {
			gotoGroup(id) {
				this.$utils.redirect('/pages/im/group/index', {
					id: id
				})
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
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		width: 600rpx;
		color: $u-main-color;
		margin-bottom: 15rpx;
	}
	
	.info .meta {
		color: $u-tips-color;
	}

	.meta uni-text {
		margin-right: 15rpx;
	}
</style>
