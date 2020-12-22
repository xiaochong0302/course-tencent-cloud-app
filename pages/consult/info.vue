<template>
	<view class="container" v-if="consult.id > 0">
		<view class="title" v-if="consult.course.id > 0">课程：{{ consult.course.title }}</view>
		<view class="title" v-if="consult.chapter.id > 0">章节：{{ consult.chapter.title }}</view>
		<view class="question">
			<view class="label">提问：</view>
			<view class="content">{{ consult.question }}</view>
		</view>
		<view class="answer">
			<view class="label">回复：</view>
			<view class="content">{{ consult.answer }}</view>
		</view>
		<view class="time">时间：{{ consult.create_time|timeFormat('yyyy-mm-dd hh:MM') }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				consult: {
					course: {},
					chapter: {},
				}
			}
		},
		onLoad(e) {
			this.loadConsult(e.id)
		},
		methods: {
			loadConsult(id) {
				this.$api.getConsultInfo(id).then(res => {
					this.consult = this.handleConsult(res.consult)
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			},
			handleConsult(consult) {
				if (consult.answer == '') {
					consult.answer = '请耐心等待回复吧！'
				}
				return consult
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 30rpx;
	}

	.title {
		color: $u-main-color;
		margin-bottom: 30rpx;
	}

	.question {
		display: flex;
		margin-bottom: 30rpx;
	}

	.answer {
		display: flex;
		margin-bottom: 30rpx;
	}
	
	.content {
		flex: 1;
	}
</style>
