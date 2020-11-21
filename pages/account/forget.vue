<template>
	<view class="container">
		<u-form :model="form" ref="form">
			<u-verification-code seconds="60" ref="verifyCode" @change="verifyCodeChange"></u-verification-code>
			<u-form-item label="手机号" label-width="150" prop="account">
				<u-input v-model="form.account" type="number" maxlength="11" placeholder="请输入手机号"></u-input>
			</u-form-item>
			<u-form-item label="新密码" label-width="150" prop="new_password">
				<u-input v-model="form.new_password" type="password" maxlength="16" placeholder="请输入新密码" :password-icon="true"></u-input>
			</u-form-item>
			<u-form-item label="验证码" label-width="150" prop="verify_code">
				<u-input v-model="form.verify_code" type="number" maxlength="6" placeholder="请输入验证码"></u-input>
				<u-button slot="right" type="success" size="mini" :disabled="verifyDisabled" @click="getVerifyCode">{{ verifyCodeTips }}</u-button>
			</u-form-item>
			<view class="form-item">
				<u-button type="primary" @click="submit">重置密码</u-button>
			</view>
			<view class="form-item">
				<view class="link">
					<text @click="gotoLogin">用户登录</text>
					<text @click="gotoRegister">用户注册</text>
				</view>
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
				verifyCodeTips: '',
				form: {
					account: '',
					new_password: '',
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
					new_password: [{
						required: true,
						message: '请填写账户密码'
					}, {
						min: 6,
						max: 16,
						message: '密码6-16个字符'
					}],
					verify_code: [{
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
						if (res.ret == 0) {
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
						this.$api.resetPassword({
							account: this.form.account,
							new_password: this.form.new_password,
							verify_code: this.form.verify_code
						}).then(res => {
							this.$u.toast('重置密码成功')
							setTimeout(function() {
								this.gotoLogin()
							}, 3000)
						}).catch(e => {
							this.$u.toast(e.msg)
						})
					}
				})
			},
			gotoLogin() {
				this.$utils.redirect('/pages/account/login')
			},
			gotoRegister() {
				this.$utils.redirect('/pages/account/register')
			}
		}
	}
</script>

<style>

</style>
