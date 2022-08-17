<template>
	<view class="container" v-if="user.id > 0">
		<view class="user">
			<view class="avatar">
				<u-avatar :src="user.avatar|thumbAvatar" size="large"></u-avatar>
			</view>
			<view class="name">{{ user.name }}</view>
		</view>
		<u-sticky :enable="enableSticky" h5-nav-height="0">
			<view class="tab-title">
				<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
			</view>
		</u-sticky>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				<view class="profile">
					<view class="about">{{ user.about }}</view>
				</view>
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<view class="course-list" v-if="courses.length > 0">
					<user-course-list :items="courses"></user-course-list>
				</view>
				<view class="load-more" @click="gotoCourseList(user.id)" v-if="courses.length > 10">
					<u-divider half-width="50">加载更多</u-divider>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UserCourseList from '@/components/user-course-list.vue'
	export default {
		components: {
			UserCourseList,
		},
		data() {
			return {
				enableSticky: false,
				currentTab: 0,
				tabs: [{
					name: '介绍'
				}, {
					name: '课程'
				}],
				courses: [],
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
			}
		}
	}
</script>

<style>
	.user {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.user .avatar {
		margin-bottom: 15rpx;
	}

	.user .name {
		margin-bottom: 15rpx;
	}

	.tab-title {
		margin-bottom: 15rpx;
	}

	.course-list {
		margin-bottom: 30rpx;
	}

	.load-more {
		text-align: center;
		margin-bottom: 30rpx;
	}
</style>
