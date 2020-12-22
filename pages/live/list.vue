<template>
	<view class="container">
		<view class="live-list" v-if="items.length > 0">
			<live-list :items="items"></live-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import LiveList from '@/components/live-list.vue'
	export default {
		components: {
			LiveList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				loadMore: 'loadmore',
				scrollTop: 0,
			}
		},
		methods: {
			onLoad() {
				this.loadLives()
			},
			onReachBottom() {
				if (this.hasMore) {
					this.loadLives()
				}
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			loadLives() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getLiveList(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
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
		padding-top: 30rpx;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
