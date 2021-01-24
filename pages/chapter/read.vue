<template>
	<view class="container" v-if="chapter.id > 0">
		<view class="title">{{ chapter.title }}</view>
		<view class="content markdown-body">
			<u-parse :html="chapter.content"></u-parse>
		</view>
		<view class="action">
			<u-icon :name="likeIcon.name" size="36" :color="likeIcon.color" :label="chapter.like_count" @click="likeChapter(chapter.id)"></u-icon>
			<u-icon name="account" size="36" :label="chapter.user_count"></u-icon>
			<u-icon name="chat" size="36" :label="chapter.consult_count" @click="addConsult(chapter.id)"></u-icon>
		</view>
		<view class="course">
			<u-section :title="chapter.course.title" sub-title="详情" @click="gotoCourse(chapter.course.id)"></u-section>
		</view>
		<view class="consult-list" v-if="consults.length > 0">
			<consult-list :items="consults"></consult-list>
		</view>
		<u-loadmore :status="loadMore" v-if="consults.length > 0"></u-loadmore>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import ConsultList from '@/components/consult-list.vue'
	export default {
		components: {
			ConsultList
		},
		data() {
			return {
				chapter: {
					course: {},
					me: {},
				},
				learning: {
					interval: null,
					interval_time: 15000,
					request_id: this.$u.guid(16),
					plan_id: 0,
				},
				consults: [],
				page: 1,
				hasMore: false,
				loadMore: 'loadmore',
				scrollTop: 0,
			}
		},
		computed: {
			likeIcon: function() {
				let liked = this.chapter.me.liked == 1
				return {
					name: liked ? 'thumb-up-fill' : 'thumb-up',
					color: liked ? 'red' : '',
				}
			}
		},
		onLoad(e) {
			this.loadChapter(e.id)
			this.setLearningInterval()
		},
		onUnload() {
			this.clearLearningInterval()
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadConsults(this.chapter.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			setLearningInterval() {
				this.clearLearningInterval()
				this.learning.interval = setInterval(this.learningChapter, this.learning.interval_time)
			},
			clearLearningInterval() {
				if (this.learning.interval != null) {
					clearInterval(this.learning.interval)
					this.learning.interval = null
				}
			},
			learningChapter() {
				this.$api.learningChapter(this.chapter.id, {
					plan_id: this.learning.plan_id,
					request_id: this.learning.request_id,
					interval_time: this.learning.interval_time,
				}).catch(e => {
					console.log(e.msg)
				})
			},
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			},
			addConsult(id) {
				this.$utils.redirect('/pages/consult/add', {
					chapter_id: id
				})
			},
			likeChapter(id) {
				this.$api.likeChapter(id).then(res => {
					if (this.chapter.me.liked == 1) {
						this.chapter.me.liked = 0
						this.chapter.like_count--
					} else {
						this.chapter.me.liked = 1
						this.chapter.like_count++
					}
				}).catch(e => {
					this.$u.toast('喜欢课时失败')
				})
			},
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.learning.plan_id = res.chapter.me.plan_id
				}).catch(e => {
					this.$u.toast('加载课时失败')
				})
			},
			loadConsults(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getChapterConsults(id, params).then(res => {
					this.consults = this.consults.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 30rpx;
	}

	.title {
		color: $u-main-color;
		margin-bottom: 30rpx;
	}

	.content {
		margin-bottom: 30rpx;
	}

	.action {
		display: flex;
		margin-bottom: 30rpx;
	}

	.action .u-icon {
		margin-right: 30rpx;
	}

	.course {
		margin-bottom: 30rpx;
	}

	.u-load-more-wrap {
		padding: 30rpx;
	}
</style>
