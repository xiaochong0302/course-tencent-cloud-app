<template>
	<view class="container">
		<view class="friend-list" v-if="items.length > 0">
			<user-friend-list :items="items"></user-friend-list>
		</view>
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
				scrollTop: 0,
				user: {},
			}
		},
		onLoad(e) {
			this.user.id = e.id
			this.loadFriends()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadFriends()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			loadFriends() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				params.limit = this.limit
				this.$api.getUserFriends(this.user.id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
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
	padding-top: 50rpx;
}
</style>
