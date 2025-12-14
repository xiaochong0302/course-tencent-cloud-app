<template>
	<view class="container">
		<view class="search">
			<u-search v-model="query" :show-action="false" maxlength="30" placeholder="请输入搜索内容" @search="search">
			</u-search>
		</view>
		<view class="course-list" v-if="courseObj.items.length > 0">
			<course-list :items="courseObj.items"></course-list>
		</view>
		<u-loadmore :status="courseObj.loadMore" v-if="courseObj.items.length > 0"></u-loadmore>
		<u-empty :show="courseObj.showEmpty" margin-top="100"></u-empty>
	</view>
</template>

<script>
	import CourseList from '@/components/course-list.vue'
	export default {
		components: {
			CourseList,
		},
		data() {
			return {
				courseObj: {
					items: [],
					page: 1,
					hasMore: false,
					loadMore: 'loadmore',
					showEmpty: false,
				},
				query: '',
			}
		},
		onLoad(e) {
			if (e.query.length > 1) {
				this.query = e.query
				this.loadCourseResult()
			}
		},
		onReachBottom() {
			if (this.courseObj.hasMore) {
				this.loadCourseResult()
			}
		},
		methods: {
			search() {
				if (this.query.length > 1) {
					this.courseObj.hasMore = false
					this.courseObj.items = []
					this.courseObj.page = 1
					this.loadCourseResult()
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
			handleCourses(courses) {
				return courses.map(course => {
					course.title = course.title.replace(/<\/?.+?>/g, '')
					return course
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		margin-bottom: 30rpx;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
