<template>
	<view class="container">
		<u-form :model="form" ref="form" :error-type="['toast']">
			<u-verification-code seconds="60" ref="verifyCode" @change="verifyCodeChange"></u-verification-code>
			<u-form-item label="账号" prop="account">
				<u-input v-model="form.account" type="number" maxlength="11" placeholder="请输入手机号"></u-input>
			</u-form-item>
			<u-form-item label="密码" prop="password">
				<u-input v-model="form.password" type="password" maxlength="16" placeholder="请输入密码" :password-icon="true"></u-input>
			</u-form-item>
			<u-form-item label="验证码" label-width="150" prop="verifyCode">
				<u-input v-model="form.verify_code" type="number" maxlength="6" placeholder="请输入验证码"></u-input>
				<u-button slot="right" type="success" size="mini" :disabled="verifyDisabled" @click="getVerifyCode">{{verifyCodeTips}}</u-button>
			</u-form-item>
			<view class="form-item">
				<u-button type="primary" @click="submit">注册</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	import {
		captchaCreater
	} from '@/common/captcha.js'
	export default {
		data() {
			return {
				redirect: '/pages/me/index',
				verifyCodeTips: '',
				form: {
					account: '',
					password: '',
					verify_code: ''
				},
				rules: {
					account: [{
						required: true,
						message: '请填写手机号'
					}, {
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value)
						},
						message: '无效的手机号'
					}],
					password: [{
						required: true,
						message: '请填写账户密码'
					}, {
						min: 6,
						max: 16,
						message: '密码6-16个字符'
					}],
					verifyCode: [{
						required: true,
						message: '请填写验证码'
					}, {
						len: 6,
						message: '无效的验证码'
					}]
				}
			}
		},
		computed: {
			verifyDisabled: function() {
				return !this.$u.test.mobile(this.form.account)
			}
		},
		onLoad(e) {
			if (e.redirect) {
				this.redirect = e.redirect
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			verifyCodeChange(text) {
				this.verifyCodeTips = text
			},
			getVerifyCode: async function() {
				if (!this.$refs.verifyCode.canGetCode) {
					return false
				}
				try {
					uni.showLoading({
						mask: true
					})
					const captcha = await captchaCreater(res => {
						if (res.ret === 0) {
							this.$api.sendSmsVerifyCode({
								phone: this.form.account,
								ticket: res.ticket,
								rand: res.randstr
							})
							this.$u.toast('已发送验证码')
							this.$refs.verifyCode.start()
						}
					})
					captcha.show()
				} catch (error) {
					throw new Error(error)
				} finally {
					uni.hideLoading()
				}
			},
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$api.registerAccount({
							account: this.form.account,
							password: this.form.password,
							verify_code: this.form.verify_code
						}).then(res => {
							this.$utils.setToken(res.token)
							this.$utils.redirect(this.redirect)
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

</style>
