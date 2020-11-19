<template>
	<view class="item-list">
		<view class="item" v-for="group in groups" :key="group.id" @click="gotoGroup(group.id)">
			<view class="avatar">
				<u-image width="120" height="120" shape="circle" :src="group.avatar|thumbAvatar"></u-image>
			</view>
			<view class="info">
				<view class="name u-line-2">{{ group.name }}</view>
				<view class="meta">
					<u-icon name="account" :label="group.user_count"></u-icon>
					<u-icon name="chat" :label="group.msg_count"></u-icon>
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
				this.$utils.redirect(`/pages/im/group/index?id=${id}`)
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
		margin-right: 15rpx;
	}
	
	.item .info {
		flex: 1;
	}

	.item .name {
		margin-bottom: 15rpx;
	}

	.meta .u-icon {
		margin-right: 15rpx;
	}
</style>
