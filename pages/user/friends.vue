<template>
	<view class="container">
		<view class="friend-list" v-if="items.length > 0">
			<user-friend-list :items="items"></user-friend-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty"></u-empty>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import UserFriendList from '@/components/user-friend-list.vue'
	export default {
		components: {
			UserFriendList
		},
		data() {
			return {
				items: [],
				page: 1,
				limit: 20,
				hasMore: false,
				loadMore: 'loadmore',
				showEmpty: false,
				scrollTop: 0,
				user: {},
			}
		},
		onLoad(e) {
			this.user.id = e.id
			this.loadFriends(e.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadFriends(this.user.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadFriends(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				params.limit = this.limit
				this.$api.getUserFriends(id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载好友失败')
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
