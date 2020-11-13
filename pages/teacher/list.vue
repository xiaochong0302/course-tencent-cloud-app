<template>
	<view class="container">
		<view class="teacher-list">
			<teacher-list :teachers="items"></teacher-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import TeacherList from '@/components/teacher-list.vue'
	export default {
		components: {
			TeacherList
		},
		data() {
			return {
				items: [],
				page: 1,
				limit: 15,
				hasMore: false,
				scrollTop: 0,
			}
		},
		methods: {
			onLoad() {
				this.loadTeachers()
			},
			onReachBottom() {
				if (this.hasMore) {
					this.loadTeachers()
				}
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			loadTeachers() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				params.limit = this.limit
				this.$api.getTeacherList(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载列表失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding-top: 30px;
	}
</style>
