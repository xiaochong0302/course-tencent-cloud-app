<template>
	<view class="container">
		<view class="top">
			<view class="avatar">
				<u-image width="90" height="90" shape="circle" :src="teacher.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name">{{ teacher.name }}</view>
			<view class="title">{{ teacher.title }}</view>
		</view>
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				{{ teacher.about }}
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<course-list :courses="courses"></course-list>
			</view>
		</view>
	</view>
</template>

<script>
	import CourseList from '@/components/kg-course-list/course-list.vue'
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
</style>
