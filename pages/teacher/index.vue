<template>
	<view class="container" v-if="teacher.id > 0">
		<view class="user">
			<view class="avatar">
				<u-avatar :src="teacher.avatar|thumbAvatar" size="large"></u-avatar>
			</view>
			<view class="name">{{ teacher.name }}</view>
		</view>
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				<view class="profile">
					<view class="about">{{ teacher.about }}</view>
				</view>
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<view class="course-list" v-if="courses.length > 0">
					<course-list :items="courses"></course-list>
				</view>
				<view class="load-more" @click="gotoCourseList(user.id)" v-if="courses.length > 10">
					<u-divider half-width="50">加载更多</u-divider>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CourseList from '@/components/course-list.vue'
	export default {
		components: {
			CourseList
		},
		data() {
			return {
				teacher: {},
				courses: [],
				tabs: [{
					name: '介绍'
				}, {
					name: '课程'
				}],
				currentTab: 0
			}
		},
		onLoad(e) {
			this.loadTeacherInfo(e.id)
			this.loadTeacherCourses(e.id)
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			gotoCourseList(id) {
				this.$utils.redirect('/pages/teacher/courses', {
					id: id
				})
			},
			loadTeacherInfo(id) {
				this.$api.getTeacherInfo(id).then(res => {
					this.teacher = res.teacher
				}).catch(e => {
					this.$u.toast('加载教师失败')
				})
			},
			loadTeacherCourses(id) {
				this.$api.getTeacherCourses(id).then(res => {
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

	.load-more {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		text-align: center;
	}
</style>
