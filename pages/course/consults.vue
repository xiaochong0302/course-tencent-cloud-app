<template>
	<view class="container">
		<view class="review-list">
			<consult-list :consults="items"></consult-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import ConsultList from '@/components/consult-list.vue'
	export default {
		components: {
			ConsultList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				courseId: 0,
				scrollTop: 0,
			}
		},
		onLoad(e) {
			this.courseId = e.id
			this.loadConsults()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadConsults()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadConsults() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseConsults(this.courseId, params).then(res => {
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
