<template>
	<view class="container">
		<view class="top">
			<view class="avatar">
				<u-image width="90" height="90" shape="circle" :src="user.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name">{{ user.name }}</view>
			<view class="title">{{ user.title }}</view>
		</view>
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-item" v-if="currentTab == 0">
				{{ user.about }}
			</view>
			<view class="tab-item" v-if="currentTab == 1">
				<view class="course-list">
					<view class="course" v-for="(item,index) in courses" :key="item.key">
						<view class="cover">
							<u-image width="240" height="134" border-radius="10" :src="item.course.cover|thumbCover"></u-image>
						</view>
						<view class="info">
							<view class="title u-line-1">{{ item.course.title }}</view>
							<view class="meta">
								<text class="lesson">课时：{{ item.course.lesson_count }}</text>
								<text class="rating">评分：{{ item.course.rating }}</text>
							</view>
							<view class="meta">
								<text class="progress">进度：{{ item.progress }}%</text>
								<text class="duration">用时：{{ item.duration|formatDuration }}</text>
							</view>
						</view>
					</view>
				</view>
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
				user: {},
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
			this.loadUserInfo(e.id)
			this.loadUserCourses(e.id)
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
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
