<template>
	<view class="container">
		<view class="group">
			<view class="avatar">
				<u-avatar :src="group.avatar|thumbAvatar" size="large"></u-avatar>
			</view>
			<view class="name">{{ group.name }}</view>
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
	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.group .avatar {
		margin-bottom: 15rpx;
	}

	.group .name {
		margin-bottom: 15rpx;
	}

	.tab-title {
		margin-bottom: 30rpx;
	}
</style>
