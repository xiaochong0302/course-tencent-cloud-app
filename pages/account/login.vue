<template>
	<view class="container">
		<form v-if="loginType==='password'" @submit="loginByPassword">
			<view class="form-item">
				<view class="input">
					<input name="account" maxlength="30" placeholder="请输入手机/邮箱" />
				</view>
			</view>
			<view class="form-item">
				<view class="input">
					<input name="password" password="true" maxlength="16" placeholder="请输入密码" />
				</view>
			</view>
			<view class="form-item">
				<view class="action">
					<button type="primary" form-type="submit">登录</button>
				</view>
			</view>
			<view class="form-item">
				<view class="link">
					<text @click="loginType='verify'">验证登录</text>
					<text @click="gotoForget">忘记密码</text>
					<text @click="gotoRegister">用户注册</text>
				</view>
			</view>
		</form>
		<form v-else-if="loginType==='verify'" @submit="loginByVerify">
			<view class="form-item">
				<view class="input">
					<input v-model="account" name="account" type="number" maxlength="11" placeholder="请输入手机号" />
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
					<button type="primary" form-type="submit">登录</button>
				</view>
			</view>
			<view class="form-item">
				<view class="link">
					<text @click="loginType='password'">密码登录</text>
					<text @click="gotoForget">忘记密码</text>
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
				loginType: 'password',
				redirectUrl: '/pages/index/index',
				showVerify: true,
				verifyCode: '',
				account: '',
			}
		},
		computed: {
			verifyDisabled: function() {
				let phoneOk = Validator.phone(this.account)
				return !phoneOk
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
			loginByPassword(e) {
				let data = e.detail.value
				if (!Validator.phone(data.account) && !Validator.email(data.account)) {
					this.$u.toast('无效的手机/邮箱账号')
					return false
				}
				if (!Validator.password(data.password)) {
					this.$u.toast('无效的账户密码')
					return false
				}
				this.$api.loginByPassword(data).then(res => {
					this.$utils.setToken(res.token)
					this.$utils.redirect(this.redirectUrl)
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			loginByVerify(e) {
				let data = e.detail.value
				if (!Validator.phone(data.account)) {
					this.$u.toast('无效的手机号')
					return false
				}
				if (!Validator.verifyCode(data.verify_code)) {
					this.$u.toast('无效的验证码')
					return false
				}
				this.$api.loginByVerify(data).then(res => {
					this.$utils.setToken(res.token)
					this.$utils.redirect(this.redirectUrl)
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			gotoForget() {
				this.$utils.redirect('/pages/account/forget')
			},
			gotoRegister() {
				this.$utils.redirect('/pages/account/register')
			}
		}
	}
</script>

<style>

</style>
