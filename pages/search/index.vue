<template>
	<view class="container">
		<view class="search">
			<u-search v-model="query" :show-action="false" maxlength="30" placeholder="请输入搜索内容" @search="search"></u-search>
		</view>
		<u-sticky :enable="enableSticky" h5-nav-height="0">
			<view class="tab-title">
				<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
			</view>
		</u-sticky>
		<view class="tab-content">
			<view v-if="currentTab == 0">
				<view class="course-list" v-if="courseObj.items.length > 0">
					<course-list :items="courseObj.items"></course-list>
				</view>
				<u-loadmore :status="courseObj.loadMore" v-if="courseObj.items.length > 0"></u-loadmore>
				<u-empty :show="courseObj.showEmpty" margin-top="100"></u-empty>
			</view>
			<view v-if="currentTab == 1">
				<view class="group-list" v-if="groupObj.items.length > 0">
					<group-list :items="groupObj.items"></group-list>
				</view>
				<u-loadmore :status="groupObj.loadMore" v-if="groupObj.items.length > 0"></u-loadmore>
				<u-empty :show="groupObj.showEmpty" margin-top="100"></u-empty>
			</view>
			<view v-if="currentTab == 2">
				<view class="user-list" v-if="userObj.items.length > 0">
					<user-list :items="userObj.items"></user-list>
				</view>
				<u-loadmore :status="userObj.loadMore" v-if="userObj.items.length > 0"></u-loadmore>
				<u-empty :show="userObj.showEmpty" margin-top="100"></u-empty>
			</view>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import CourseList from '@/components/course-list.vue'
	import GroupList from '@/components/group-list.vue'
	import UserList from '@/components/user-list.vue'
	export default {
		components: {
			CourseList,
			GroupList,
			UserList,
		},
		data() {
			return {
				enableSticky: false,
				scrollTop: 0,
				currentTab: 0,
				tabs: [{
					name: '课程'
				}, {
					name: '群组'
				}, {
					name: '用户'
				}],
				courseObj: {
					items: [],
					page: 1,
					hasMore: false,
					loadMore: 'loadmore',
					showEmpty: false,
				},
				groupObj: {
					items: [],
					page: 1,
					hasMore: false,
					loadMore: 'loadmore',
					showEmpty: false,
				},
				userObj: {
					items: [],
					page: 1,
					limit: 16,
					hasMore: false,
					loadMore: 'loadmore',
					showEmpty: false,
				},
				query: '',
			}
		},
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
		},
		onLoad(e) {
			if (e.query.length > 1) {
				this.query = e.query
				this.loadCourseResult()
				this.loadGroupResult()
				this.loadUserResult()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onReachBottom() {
			if (this.currentTab == 0) {
				if (this.courseObj.hasMore) {
					this.loadCourseResult()
				}
			} else if (this.currentTab == 1) {
				if (this.groupObj.hasMore) {
					this.loadGroupResult()
				}
			} else if (this.currentTab == 2) {
				if (this.userObj.hasMore) {
					this.loadUserResult()
				}
			}
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			search() {
				if (this.query.length > 1) {
					this.courseObj.hasMore = false
					this.courseObj.items = []
					this.courseObj.page = 1
					this.loadCourseResult()

					this.groupObj.hasMore = false
					this.groupObj.items = []
					this.groupObj.page = 1
					this.loadGroupResult()

					this.userObj.hasMore = false
					this.userObj.items = []
					this.userObj.page = 1
					this.loadUserResult()
				}
			},
			loadCourseResult() {
				let params = {
					query: this.query,
					type: 'course',
				}
				if (this.courseObj.page > 0) {
					params.page = this.courseObj.page
				}
				this.$api.search(params).then(res => {
					let items = this.handleCourses(res.pager.items)
					this.courseObj.items = this.courseObj.items.concat(items)
					this.courseObj.hasMore = res.pager.total_pages > this.courseObj.page
					this.courseObj.loadMore = this.courseObj.hasMore ? 'loadmore' : 'nomore'
					this.courseObj.showEmpty = this.courseObj.page == 1 && res.pager.total_pages == 0
					this.courseObj.page++
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			},
			loadGroupResult() {
				let params = {
					query: this.query,
					type: 'group',
				}
				if (this.groupObj.page > 0) {
					params.page = this.groupObj.page
				}
				this.$api.search(params).then(res => {
					let items = this.handleGroups(res.pager.items)
					this.groupObj.items = this.groupObj.items.concat(items)
					this.groupObj.hasMore = res.pager.total_pages > this.groupObj.page
					this.groupObj.loadMore = this.groupObj.hasMore ? 'loadmore' : 'nomore'
					this.groupObj.showEmpty = this.groupObj.page == 1 && res.pager.total_pages == 0
					this.groupObj.page++
				}).catch(e => {
					this.$u.toast('加载群组失败')
				})
			},
			loadUserResult() {
				let params = {
					query: this.query,
					type: 'user',
				}
				if (this.userObj.page > 0) {
					params.page = this.userObj.page
				}
				params.limit = this.userObj.limit
				this.$api.search(params).then(res => {
					let items = this.handleUsers(res.pager.items)
					this.userObj.items = this.userObj.items.concat(items)
					this.userObj.hasMore = res.pager.total_pages > this.userObj.page
					this.userObj.loadMore = this.userObj.hasMore ? 'loadmore' : 'nomore'
					this.userObj.showEmpty = this.userObj.page == 1 && res.pager.total_pages == 0
					this.userObj.page++
				}).catch(e => {
					this.$u.toast('加载用户失败')
				})
			},
			handleCourses(courses) {
				return courses.map(course => {
					course.title = course.title.replace(/<\/?.+?>/g, '')
					return course
				})
			},
			handleGroups(groups) {
				return groups.map(group => {
					group.name = group.name.replace(/<\/?.+?>/g, '')
					return group
				})
			},
			handleUsers(users) {
				return users.map(user => {
					user.name = user.name.replace(/<\/?.+?>/g, '')
					return user
				})
			}
		}
	}
</script>

<style>
	.search {
		margin-bottom: 15rpx;
	}

	.tab-title {
		margin-bottom: 30rpx;
	}
	
	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
