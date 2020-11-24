<template>
	<view class="container">
		<u-sticky :enable="enableSticky">
			<view class="filter">
				<u-dropdown>
					<u-dropdown-item title="排序" v-model="sort" :options="sorts" @change="switchSort"></u-dropdown-item>
					<u-dropdown-item title="难度" v-model="level" :options="levels" @change="switchLevel"></u-dropdown-item>
					<u-dropdown-item title="类型" v-model="model" :options="models" @change="switchModel"></u-dropdown-item>
				</u-dropdown>
			</view>
		</u-sticky>
		<view class="course-list" v-if="items.length > 0">
			<course-list :items="items"></course-list>
		</view>
		<u-loadmore :status="loadMore" v-if="items.length > 0"></u-loadmore>
		<u-empty :show="showEmpty" margin-top="100"></u-empty>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import CourseList from '@/components/course-list.vue'
	export default {
		components: {
			CourseList
		},
		data() {
			return {
				items: [],
				page: 1,
				hasMore: false,
				showEmpty: false,
				loadMore: 'loadmore',
				enableSticky: true,
				scrollTop: 0,
				sc: 0,
				level: 0,
				model: 0,
				sort: 'score',
				models: [{
					label: '全部',
					value: 0
				}, {
					label: '点播',
					value: 1
				}, {
					label: '直播',
					value: 2
				}, {
					label: '专栏',
					value: 3
				}],
				levels: [{
					label: '全部',
					value: 0
				}, {
					label: '入门',
					value: 1
				}, {
					label: '初级',
					value: 2
				}, {
					label: '中级',
					value: 3
				}, {
					label: '高级',
					value: 4
				}],
				sorts: [{
					label: '综合',
					value: 'score'
				}, {
					label: '好评',
					value: 'rating'
				}, {
					label: '最新',
					value: 'latest'
				}, {
					label: '最热',
					value: 'popular'
				}, {
					label: '免费',
					value: 'free'
				}],
			}
		},
		onLoad(e) {
			if (e.sc) {
				this.sc = parseInt(e.sc)
			}
			this.loadCourses()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadCourses()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
		},
		methods: {
			switchLevel(level) {
				this.level = level
				this.doFilter()
			},
			switchModel(model) {
				this.model = model
				this.doFilter()
			},
			switchSort(sort) {
				this.sort = sort
				this.doFilter()
			},
			doFilter() {
				this.items = []
				this.page = 1
				this.hasMore = false
				this.loadCourses()
			},
			loadCourses() {
				let params = {}
				if (this.sc > 0) {
					params.sc = this.sc
				}
				if (this.model > 0) {
					params.model = this.model
				}
				if (this.level > 0) {
					params.level = this.level
				}
				if (this.sort != '') {
					params.sort = this.sort
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseList(params).then(res => {
					this.items = this.items.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.loadMore = this.hasMore ? 'loadmore' : 'nomore'
					this.showEmpty = this.page == 1 && res.pager.total_pages == 0
					this.page++
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			}
		}
	}
</script>

<style>
	.filter {
		background-color: #FFFFFF;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
