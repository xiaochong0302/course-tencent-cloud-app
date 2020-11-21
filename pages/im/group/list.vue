<template>
	<view class="container">
		<view class="group-list">
			<group-list :items="items"></group-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import GroupList from '@/components/group-list.vue'
	export default {
		components: {
			GroupList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				scrollTop: 0,
			}
		},
		methods: {
			onLoad() {
				this.loadGroups()
			},
			onReachBottom() {
				if (this.hasMore) {
					this.loadGroups()
				}
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			loadGroups() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getImGroupList(params).then(res => {
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
		padding-top: 30rpx;
	}
</style>
