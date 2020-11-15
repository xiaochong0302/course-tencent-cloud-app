<template>
	<view class="item-list">
		<view class="item" v-for="group in showGroups" :key="group.id" @click="gotoGroup(group.id)">
			<view class="avatar">
				<u-image width="120" height="120" shape="circle" :src="group.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name u-line-2">{{ group.name }}</view>
			<view class="meta">
				<text>成员：{{ group.user_count }}</text>
				<text>讨论：{{ group.msg_count }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GroupList',
		data() {
			return {
				showGroups: []
			}
		},
		props: {
			items: {
				type: Array
			}
		},
		created() {
			this.showGroups = this.handleGroups(this.items)
		},
		watch: {
			items: function() {
				this.showGroups = this.handleGroups(this.items)
			}
		},
		methods: {
			gotoGroup(id) {
				this.$utils.redirect(`/pages/im/group/index?id=${id}`)
			},
			handleGroups(groups) {
				return groups
			}
		}
	}
</script>

<style>
	.item-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 350rpx;
		margin-bottom: 50rpx;
		text-align: center;
		overflow: hidden;
	}

	.item .avatar {
		margin-bottom: 15rpx;
	}

	.item .name {
		margin-bottom: 15rpx;
	}
	
	.meta uni-text {
		margin-right: 15rpx;
	}
</style>
