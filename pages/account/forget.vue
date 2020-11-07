<template>
	<view class="container">
		<form @submit="resetPassword">
			<view class="form-item">
				<view class="input">
					<input v-model="account" name="account" maxlength="30" placeholder="请输入手机/邮箱" />
				</view>
			</view>
			<view class="form-item">
				<view class="input">
					<input v-model="newPassword" name="new_password" maxlength="16" placeholder="请输入新设密码" />
				</view>
			</view>
			<view class="form-item">
				<view class="input">
					<input v-model="verifyCode" name="verify_code" type="number" maxlength="6" placeholder="请输入验证码" />
				</view>
			</view>
			<view class="form-item" v-if="showVerify">
				<view class="verify">
					<button type="default" :disabled="verifyDisabled" @click="getVerifyCode">获取验证码</button>
				</view>
			</view>
			<view class="form-item">
				<view class="action">
					<button type="primary" form-type="submit">重置密码</button>
				</view>
			</view>
			<view class="form-item">
				<view class="link">
					<text @click="gotoLogin">用户登录</text>
					<text @click="gotoRegister">用户注册</text>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import * as Validator from '@/common/validator.js'
	import {
		captchaCreater
	} from '@/common/captcha.js'
	export default {
		data() {
			return {
				account: '',
				newPassword: '',
				verifyCode: '',
				showVerify: true,
			}
		},
		computed: {
			verifyDisabled: function() {
				let phoneOk = Validator.phone(this.account)
				let emailOk = Validator.email(this.account)
				let passwordOk = Validator.password(this.newPassword)
				return !((phoneOk || emailOk) && passwordOk)
			}
		},
		methods: {
			getVerifyCode: async function() {
				try {
					uni.showLoading({
						mask: true
					})
					const captcha = await captchaCreater(res => {
						if (res.ret === 0) {
							if (Validator.phone(this.account)) {
								this.$api.sendSmsVerifyCode({
									phone: this.account,
									ticket: res.ticket,
									rand: res.randstr
								})
							} else {
								this.$api.sendEmailVerifyCode({
									email: this.account,
									ticket: res.ticket,
									rand: res.randstr
								})
							}
							this.showVerify = false
							this.$utils.showSuccessMsg('已发送验证码')
						}
					})
					captcha.show()
				} catch (error) {
					throw new Error(error)
				} finally {
					uni.hideLoading()
				}
			},
			resetPassword(e) {
				let data = e.detail.value
				if (!Validator.phone(data.account) && !Validator.email(data.account)) {
					this.$u.toast('无效的手机/邮箱账号')
					return false
				}
				if (!Validator.password(data.new_password)) {
					this.$u.toast('无效的用户密码')
					return false
				}
				if (!Validator.verifyCode(data.verify_code)) {
					this.$u.toast('无效的验证码')
					return false
				}
				this.$api.resetPassword(data).then(res => {
					this.$utils.showSuccessMsg('重置密码成功')
					setTimeout(function() {
						this.gotoLogin()
					}, 5000)
				}).catch(e => {
					this.$u.toast(e.msg)
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
