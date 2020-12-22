<template>
	<view class="container">
		<view class="course-list" v-if="items.length > 0">
			<course-list :items="items"></course-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
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
				items: [],
				page: 1,
				hasMore: false,
				loadMore: 'loadmore',
				scrollTop: 0,
				teacher: {},
			}
		},
		onLoad(e) {
			this.teacher.id = e.id
			this.loadCourses()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadCourses()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadCourses() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getTeacherCourses(this.teacher.id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.page++
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			}
		}
	}
</script>

<style>
	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
