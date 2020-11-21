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
				course:{},
				items: [],
				page: 1,
				hasMore: false,
				scrollTop:0,
			}
		},
		onLoad(e) {
			this.course.id = e.id
			this.loadReviews(e.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadReviews(this.course.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadReviews(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseReviews(id, params).then(res => {
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
