<template>
	<view class="container">
		<view class="top">
			<view class="avatar">
				<u-image width="90" height="90" shape="circle" :src="group.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name">{{ group.name }}</view>
			<view class="title">{{ group.title }}</view>
		</view>
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				{{ group.about }}
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<view class="user-list" v-if="users.length > 0">
					<user-list :items="users"></user-list>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UserList from '@/components/user-list.vue'
	export default {
		components: {
			UserList
		},
		data() {
			return {
				currentTab: 0,
				tabs: [{
					name: '介绍'
				}, {
					name: '成员'
				}],
				group: {},
				users: [],
			}
		},
		onLoad(e) {
			this.loadGroupInfo(e.id)
			this.loadGroupUsers(e.id)
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			loadGroupInfo(id) {
				this.$api.getImGroupInfo(id).then(res => {
					this.group = res.group
				}).catch(e => {
					this.$u.toast('加载群组失败')
				})
			},
			loadGroupUsers(id) {
				this.$api.getImGroupUsers(id).then(res => {
					this.users = res.pager.items
				}).catch(e => {
					this.$u.toast('加载成员失败')
				})
			}
		}
	}
</script>

<style>
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.top .avatar {
		margin-bottom: 15rpx;
	}

	.top .name {
		margin-bottom: 15rpx;
	}

	.tab-title {
		margin-bottom: 30rpx;
	}

	.course {
		display: flex;
		padding: 10rpx 0;
	}

	.course .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.course .info {
		flex: 1;
	}

	.course .info .title {
		font-weight: 600;
		margin-bottom: 10rpx;
		width: 465rpx;
	}

	.course .meta {
		margin-bottom: 10rpx;
	}

	.course .meta text {
		margin-right: 15rpx;
	}
</style>
