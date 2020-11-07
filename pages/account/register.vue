<template>
	<view class="container">
		<form @submit="submit">
			<view class="form-item">
				<view class="input">
					<input v-model="account" name="account" maxlength="11" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="form-item">
				<view class="input">
					<input v-model="password" name="password" maxlength="16" placeholder="请输入密码" />
				</view>
			</view>
			<view class="form-item">
				<view class="input">
					<input name="verify_code" type="number" maxlength="6" placeholder="请输入验证码" />
				</view>
			</view>
			<view class="form-item" v-if="showVerify">
				<view class="verify">
					<button type="default" :disabled="verifyDisabled" @click="getVerifyCode">获取验证码</button>
				</view>
			</view>
			<view class="form-item">
				<view class="action">
					<button type="primary" form-type="submit">注册</button>
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
				password: '',
				redirectUrl: '/pages/me/index',
				showVerify: true,
			}
		},
		computed: {
			verifyDisabled: function() {
				let phoneOk = Validator.phone(this.account)
				let passwordOk = Validator.password(this.password)
				return !(phoneOk && passwordOk)
			}
		},
		onLoad(e) {
			if (e.redirect) {
				this.redirectUrl = e.redirect
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
							this.$api.sendSmsVerifyCode({
								phone: this.account,
								ticket: res.ticket,
								rand: res.randstr
							})
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
			submit(e) {
				let data = e.detail.value
				if (!Validator.phone(data.account)) {
					this.$u.toast('无效的手机号')
					return false
				}
				if (!Validator.password(data.password)) {
					this.$u.toast('无效的用户密码')
					return false
				}
				if (!Validator.verifyCode(data.verify_code)) {
					this.$u.toast('无效的验证码')
					return false
				}
				this.$api.registerAccount(data).then(res => {
					this.$utils.setToken(res.token)
					this.$utils.redirect(this.redirectUrl)
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},

		}
	}
</script>

<style>

</style>
