<template>
	<view class="container">
		<view class="group-list" v-if="items.length > 0">
			<user-group-list :items="items"></user-group-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty"></u-empty>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import UserGroupList from '@/components/user-group-list.vue'
	export default {
		components: {
			UserGroupList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				loadMore: 'loadmore',
				showEmpty: false,
				scrollTop: 0,
				user: {},
			}
		},
		onLoad(e) {
			this.user.id = e.id
			this.loadGroups(e.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadGroups(this.user.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadGroups(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getUserGroups(id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载群组失败')
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
