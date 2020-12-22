<template>
	<view class="container">
		<view class="title" v-if="consult.course.id > 0">课程：{{ consult.course.title }}</view>
		<view class="title" v-if="consult.chapter.id > 0">章节：{{ consult.chapter.title }}</view>
		<u-form :model="consult" ref="form">
			<u-form-item label="咨询内容" label-position="top" prop="question">
				<u-input v-model="consult.question" type="textarea" :border="false" placeholder="请填写咨询内容" />
			</u-form-item>
			<view class="form-item">
				<u-button type="primary" @click="submit">提交</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				consult: {
					course: {},
					chapter: {},
					question: '',
				},
				rules: {
					question: [{
						required: true,
						message: '请填写咨询内容'
					}, {
						min: 10,
						max: 255,
						message: '咨询内容10-255字之间'
					}]
				},
			}
		},
		onLoad(e) {
			this.loadConsult(e.id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			loadConsult(id) {
				this.$api.getConsultInfo(id).then(res => {
					this.consult = res.consult
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$api.updateConsult(this.consult.id, {
							question: this.consult.question
						}).then(res => {
							this.$u.toast('更新咨询成功')
						}).catch(e => {
							this.$u.toast(e.msg)
						})
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}

	.title {
		margin-bottom: 30rpx;
	}
</style>
