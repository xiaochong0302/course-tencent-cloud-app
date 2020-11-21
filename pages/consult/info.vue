<template>
	<view class="container">
		<view class="title" v-if="consult.chapter.id > 0">章节：{{ consult.chapter.title }}</view>
		<view class="question">提问：{{ consult.question }}</view>
		<view class="answer">回复：{{ consult.answer }}</view>
		<view class="time">{{ consult.create_time|timeFormat('yyyy-mm-dd hh:MM') }}</view>
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

<style>
	.container {
		padding: 30rpx;
	}

	.title {
		font-weight: 600;
		margin-bottom: 30rpx;
	}

	.question {
		margin-bottom: 30rpx;
	}

	.answer {
		margin-bottom: 30rpx;
	}
</style>
