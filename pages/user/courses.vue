<template>
	<view class="container">
		<view class="course-list" v-if="items.length > 0">
			<user-course-list :items="items"></user-course-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import UserCourseList from '@/components/user-course-list.vue'
	export default {
		components: {
			UserCourseList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				scrollTop: 0,
				user: {},
			}
		},
		onLoad(e) {
			this.user.id = e.id
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
				this.$api.getUserCourses(this.user.id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			}
		}
	}
</script>

<style>

</style>
