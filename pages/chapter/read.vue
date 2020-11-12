<template>
	<view class="container">
		<view class="title">{{ chapter.title }}</view>
		<view class="content">{{ chapter.content }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chapter: {},
				learning: {
					interval: null,
					interval_time: 15000,
					request_id: this.$u.guid(16),
					plan_id: 0,
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
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.learning.plan_id = res.chapter.me.plan_id
				}).catch(e => {
					this.$u.toast('加载课时失败')
				})
			}
		}
	}
</script>

<style>
	.title {
		margin-bottom: 30rpx;
		font-weight: 600;
		text-align: center;
	}

	.content {}
</style>
