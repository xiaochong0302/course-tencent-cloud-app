<template>
	<view class="container">
		<view class="live-list">
			<live-list :items="items"></live-list>
		</view>
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
				limit: 15,
				hasMore: false,
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
				params.limit = this.limit
				this.$api.getLiveList(params).then(res => {
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
