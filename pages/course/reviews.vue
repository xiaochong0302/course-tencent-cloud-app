<template>
	<view class="container">
		<view class="review-list">
			<review-list :items="items"></review-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import ReviewList from '@/components/review-list.vue'
	export default {
		components: {
			ReviewList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				courseId: 0,
				scrollTop:0,
			}
		},
		onLoad(e) {
			this.courseId = e.id
			this.loadReviews()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadReviews()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadReviews() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseReviews(this.courseId, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			}
		}
	}
</script>

<style>

</style>
