<template>
	<view class="container">
		<view class="title">{{ course.title }}</view>
		<u-form :model="form" ref="form" :error-type="['toast']">
			<u-form-item label="内容实用" label-position="left" label-width="150">
				<u-rate v-model="form.rating1" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="简洁易懂" label-position="left" label-width="150">
				<u-rate v-model="form.rating2" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="逻辑清晰" label-position="left" label-width="150">
				<u-rate v-model="form.rating3" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="评价内容" label-position="top" prop="content">
				<u-input v-model="form.content" type="textarea" :border="false" placeholder="请填写评价内容" />
			</u-form-item>
		</u-form>
		<view class="action">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				course: {},
				form: {
					rating1: 5,
					rating2: 5,
					rating3: 5,
					content: '',
				},
				rules: {
					content: [{
						required: true,
						message: '请填写评价内容'
					}, {
						min: 10,
						max: 255,
						message: '评价内容10-255字之间'
					}]
				}
			}
		},
		onLoad(e) {
			this.loadCourse(e.id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			loadCourse(id) {
				this.$api.getCourseInfo(id).then(res => {
					this.course = res.course
				}).catch(e => {
					this.$u.toast('加载课程失败')
				})
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$api.createReview({
							course_id: this.course.id,
							content: this.form.content,
							rating1: this.form.rating1,
							rating2: this.form.rating2,
							rating3: this.form.rating3,
						}).then(res => {
							this.$u.toast('发布评价成功')
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
		padding: 50rpx;
	}

	.title {
		margin-bottom: 30rpx;
	}

	.u-form {
		margin-bottom: 30rpx;
	}
</style>
