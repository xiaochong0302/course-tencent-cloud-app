<template>
	<view class="container">
		<view class="review-list" v-if="items.length > 0">
			<consult-list :items="items"></consult-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty" margin-top="100"></u-empty>
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
				course: {},
				items: [],
				page: 1,
				hasMore: false,
				loadMore: 'hasmore',
				showEmpty: false,
				scrollTop: 0,
			}
		},
		onLoad(e) {
			this.course.id = e.id
			this.loadConsults(e.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadConsults(this.course.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadConsults(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseConsults(id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载评价失败')
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
