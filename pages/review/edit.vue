<template>
	<view class="container">
		<view class="title">{{ review.course.title }}</view>
		<u-form :model="review" ref="form" :error-type="['toast']">
			<u-form-item label="内容实用" label-position="left" label-width="150">
				<u-rate v-model="review.rating1" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="简洁易懂" label-position="left" label-width="150">
				<u-rate v-model="review.rating2" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="逻辑清晰" label-position="left" label-width="150">
				<u-rate v-model="review.rating3" :min-count="1"></u-rate>
			</u-form-item>
			<u-form-item label="评价内容" label-position="top" prop="content">
				<u-input v-model="review.content" type="textarea" :border="false" placeholder="请填写评价内容" />
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
				review: {
					course: {},
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
			this.loadReview(e.id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			loadReview(id) {
				this.$api.getReviewInfo(id).then(res => {
					this.review = res.review
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$api.updateReview(this.review.id, {
							content: this.review.content,
							rating1: this.review.rating1,
							rating2: this.review.rating2,
							rating3: this.review.rating3,
						}).then(res => {
							this.$u.toast('更新评价成功')
						}).catch(e => {
							this.$u.toast(e.msg)
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
