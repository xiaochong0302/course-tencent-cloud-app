<template>
	<view class="container">
		<view class="group-list" v-if="items.length > 0">
			<user-group-list :items="items"></user-group-list>
		</view>
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
				scrollTop: 0,
				user: {},
			}
		},
		onLoad(e) {
			this.user.id = e.id
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
		methods: {
			loadGroups() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getUserGroups(this.user.id, params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载群组失败')
				})
			}
		}
	}
</script>

<style>

</style>
