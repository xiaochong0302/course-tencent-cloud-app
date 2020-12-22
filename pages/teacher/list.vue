<template>
	<view class="container">
		<view class="teacher-list" v-if="items.length > 0">
			<teacher-list :items="items"></teacher-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty"></u-empty>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import TeacherList from '@/components/teacher-list.vue'
	export default {
		components: {
			TeacherList
		},
		data() {
			return {
				items: [],
				page: 1,
				limit: 20,
				hasMore: false,
				ladMore: 'loadmore',
				showEmpty: false,
				scrollTop: 0,
			}
		},
		methods: {
			onLoad() {
				this.loadTeachers()
			},
			onReachBottom() {
				if (this.hasMore) {
					this.loadTeachers()
				}
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			loadTeachers() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				params.limit = this.limit
				this.$api.getTeacherList(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
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
