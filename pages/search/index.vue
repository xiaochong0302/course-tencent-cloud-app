<template>
	<view class="container">
		<view class="search-box">
			<uni-search-bar @confirm="confirm" maxlength="30" :placeholder="query" />
		</view>
		<view v-if="type==='course'">
			<course-list :courses="items"></course-list>
		</view>
		<view v-else-if="type==='group'"></view>
		<view v-else-if="type==='user'"></view>
	</view>
</template>

<script>
	import CourseList from '@/components/kg-course-list/course-list.vue'
	export default {
		components: {
			CourseList
		},
		data() {
			return {
				items: [],
				query: '',
				type: 'course',
				page: 1,
				hasMore: false
			}
		},
		onLoad(e) {
			if (e.query) {
				this.query = e.query
			}
			this.search()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.search()
			}
		},
		methods: {
			confirm(res) {
				if (res.value.length > 1) {
					this.page = 1
					this.query = res.value
					this.hasMore = false
					this.items = []
					this.search()
				}
			},
			search() {
				let params = {}
				if (this.query !== '') {
					params.query = this.query
				}
				if (this.type !== '') {
					params.type = this.type
				}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.search(params).then(res => {
					this.hasMore = res.pager.total_pages > this.page
					this.items = this.items.concat(res.pager.items)
					switch (this.type) {
						case 'course':
							this.items = this.handleCourses(this.items)
							break;
						case 'group':
							this.items = this.handleGroups(this.items)
							break;
						case 'user':
							this.items = this.handleUsers(this.items)
							break;
					}
					this.page++
				}).catch(e => {
					this.$u.toast('加载内容失败')
				})
			},
			handleCourses(courses) {
				return courses.map(course => {
					course.title = course.title.replace(/<\/?.+?>/g, '')
					return course
				})
			},
			handleGroups(groups) {
				return groups
			},
			handleUsers(users) {
				return users
			}
		}
	}
</script>

<style>

</style>
