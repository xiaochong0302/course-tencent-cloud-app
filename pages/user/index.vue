<template>
	<view class="container" v-if="user.id > 0">
		<view class="top">
			<view class="avatar">
				<u-image :src="user.avatar|thumbAvatar" width="100" height="100" shape="circle"></u-image>
			</view>
			<view class="name">{{ user.name }}</view>
			<view class="title">{{ user.title }}</view>
		</view>
		<u-sticky :enable="enableSticky">
			<view class="tab-title">
				<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
			</view>
		</u-sticky>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				<view class="course-list" v-if="courses.length > 0">
					<user-course-list :items="courses"></user-course-list>
				</view>
				<view class="load-more" @click="gotoCourseList(user.id)" v-if="courses.length > 10">加载更多</view>
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<view class="friend-list" v-if="friends.length > 0">
					<user-friend-list :items="friends"></user-friend-list>
				</view>
				<view class="load-more" @click="gotoFriendList(user.id)" v-if="friends.length > 10">加载更多</view>
			</view>
			<view class="tab-item" v-if="currentTab == 2">
				<view class="group-list" v-if="groups.length > 0">
					<user-group-list :items="groups"></user-group-list>
				</view>
				<view class="load-more" @click="gotoGroupList(user.id)" v-if="groups.length > 10">加载更多</view>
			</view>
			<view class="tab-item" v-if="currentTab == 3">
				<view class="profile">
					<view class="about">{{ user.about }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UserCourseList from '@/components/user-course-list.vue'
	import UserFriendList from '@/components/user-friend-list.vue'
	import UserGroupList from '@/components/user-group-list.vue'
	export default {
		components: {
			UserCourseList,
			UserFriendList,
			UserGroupList,
		},
		data() {
			return {
				enableSticky: false,
				currentTab: 0,
				tabs: [{
					name: '课程'
				}, {
					name: '好友'
				}, {
					name: '群组'
				}, {
					name: '介绍'
				}],
				courses: [],
				friends: [],
				groups: [],
				user: {},
			}
		},
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
		},
		onLoad(e) {
			this.loadUserInfo(e.id)
			this.loadUserCourses(e.id)
			this.loadUserFriends(e.id)
			this.loadUserGroups(e.id)
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			gotoCourseList(id) {
				this.$utils.redirect('/pages/user/courses', {
					id: id
				})
			},
			gotoFriendList(id) {
				this.$utils.redirect('/pages/user/friends', {
					id: id
				})
			},
			gotoGroupList(id) {
				this.$utils.redirect('/pages/user/groups', {
					id: id
				})
			},
			loadUserInfo(id) {
				this.$api.getUserInfo(id).then(res => {
					this.user = res.user
				}).catch(e => {
					this.$u.toast('加载用户失败')
				})
			},
			loadUserCourses(id) {
				this.$api.getUserCourses(id).then(res => {
					this.courses = res.pager.items
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			},
			loadUserFriends(id) {
				this.$api.getUserFriends(id).then(res => {
					this.friends = res.pager.items
				}).catch(e => {
					this.$u.toast('加载好友失败')
				})
			},
			loadUserGroups(id) {
				this.$api.getUserGroups(id).then(res => {
					this.groups = res.pager.items
				}).catch(e => {
					this.$u.toast('加载群组失败')
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
		margin-bottom: 15rpx;
	}

	.course-list {
		margin-bottom: 30rpx;
	}

	.friend-list {
		padding-top: 15rpx;
	}

	.group-list {
		padding-top: 15rpx;
	}

	.load-more {
		text-align: center;
		margin-bottom: 30rpx;
	}
</style>
