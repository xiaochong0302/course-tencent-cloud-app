<template>
	<view class="container">
		<u-form :model="form" ref="form">
			<u-form-item label-position="top" prop="question">
				<u-input v-model="form.question" type="textarea" :border="false" placeholder="请填写咨询内容" />
			</u-form-item>
			<u-form-item label="私密">
				<u-radio-group v-model="private.name" @change="changePrivate">
					<u-radio v-for="(item,index) in private.options" :key="index" :name="item.name">{{ item.name }}</u-radio>
				</u-radio-group>
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
				course: {},
				chapter: {},
				private: {
					name: '否',
					value: 0,
					options: [{
						name: '是'
					}, {
						name: '否'
					}]
				},
				form: {
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
				}
			}
		},
		onLoad(e) {
			if (e.course_id) {
				this.course.id = e.course_id
			}
			if (e.chapter_id) {
				this.chapter.id = e.chapter_id
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			changePrivate(name) {
				this.private.value = (name == '是') ? 1 : 0
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						let params = {
							question: this.form.question,
							private: this.private.value,
						}
						if (this.course.id > 0) {
							params.course_id = this.course.id
						}
						if (this.chapter.id > 0) {
							params.chapter_id = this.chapter.id
						}
						this.$api.createConsult(params).then(res => {
							this.$u.toast('提交咨询成功')
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

</style>
