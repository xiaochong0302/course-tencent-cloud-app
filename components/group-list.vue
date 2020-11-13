<template>
	<view class="group-list">
		<view class="group" v-for="group in showGroups" :key="group.id" @click="gotoGroup(group.id)">
			<view class="avatar">
				<u-image width="120" height="120" shape="circle" :src="group.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name">{{ group.name }}</view>
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
			groups: {
				type: Array
			}
		},
		created() {
			this.showGroups = this.handleGroups(this.groups)
		},
		watch: {
			groups: function() {
				this.showGroups = this.handleGroups(this.groups)
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
	.group-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 350rpx;
		margin-bottom: 50rpx;
		text-align: center;
		overflow: hidden;
	}

	.group .avatar {
		margin-bottom: 15rpx;
	}

	.group .name {
		margin-bottom: 15rpx;
	}
	
	.meta uni-text {
		margin-right: 15rpx;
	}
</style>
