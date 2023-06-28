<template>
    <view class="container">
        <u-form v-if="loginType=='password'" :model="pl" ref="pl">
            <u-form-item label="账号" prop="account">
                <u-input v-model="pl.account" type="number" maxlength="11" placeholder="11位手机号码"></u-input>
            </u-form-item>
            <u-form-item label="密码" prop="password">
                <u-input v-model="pl.password" type="password" maxlength="16" placeholder="6-16个字符" :password-icon="true">
                </u-input>
            </u-form-item>
            <view class="form-item">
                <u-button type="primary" @click="loginByPassword">登录</u-button>
            </view>
            <view class="form-item">
                <view class="link">
                    <text @click="loginType='verify'">验证登录</text>
                    <text @click="gotoForget">忘记密码</text>
                    <text @click="gotoRegister">用户注册</text>
                </view>
            </view>
        </u-form>
        <u-form v-else-if="loginType=='verify'" :model="vl" ref="vl">
            <u-form-item label="手机号" label-width="150" prop="account">
                <u-input v-model="vl.account" type="number" maxlength="11" placeholder="11位手机号码"></u-input>
            </u-form-item>
            <u-form-item label="验证码" label-width="150" prop="verify_code">
                <u-input v-model="vl.verify_code" type="number" maxlength="6" placeholder="6位短信验证码"></u-input>
                <u-button slot="right" type="success" size="mini" :disabled="verifyDisabled" @click="getVerifyCaptcha">
                    {{ verifyCodeTips }}
                </u-button>
            </u-form-item>
            <view class="form-item">
                <u-button type="primary" @click="loginByVerify">登录</u-button>
            </view>
            <view class="form-item">
                <view class="link">
                    <text @click="loginType='password'">密码登录</text>
                    <text @click="gotoForget">忘记密码</text>
                    <text @click="gotoRegister">用户注册</text>
                </view>
            </view>
        </u-form>
        <u-verification-code seconds="60" ref="verifyCode" @change="verifyCodeChange"></u-verification-code>
        <u-modal :show-title="false" :show-cancel-button="true" v-model="showCaptchaModal" @cancel="hideCaptchaModal" @confirm="sendSmsVerifyCode">
            <view class="captcha-box">
                <view class="img">
                    <u-image :src="captchaImage.content" width="400" height="100"></u-image>
                </view>
                <view class="input">
                    <u-input v-model="captchaRand" type="text" :border="false" input-align="center" placeholder="请输入计算结果" />
                </view>
            </view>
        </u-modal>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                loginType: 'password',
                redirectUrl: '/pages/index/index',
                showCaptchaModal: false,
                verifyCodeTips: '',
                captchaRand: '',
                captchaImage: {
                    ticket: '',
                    content: ''
                },
                pl: {
                    account: '',
                    password: ''
                },
                vl: {
                    account: '',
                    verify_code: ''
                },
                plRules: {
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
                    }]
                },
                vlRules: {
                    account: [{
                        required: true,
                        message: '请填写手机号'
                    }, {
                        validator: (rule, value, callback) => {
                            return this.$u.test.mobile(value)
                        },
                        message: '无效的手机号'
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
                return !this.$u.test.mobile(this.vl.account)
            }
        },
        onLoad(e) {
            if (e.redirect) {
                this.redirectUrl = decodeURIComponent(e.redirect)
            }
        },
        onReady() {
            if (this.loginType == 'password') {
                this.$refs.pl.setRules(this.plRules)
            } else {
                this.$refs.vl.setRules(this.vlRules)
            }
        },
        onShow() {
            if (this.$utils.isLogin()) {
                this.$utils.redirect('/pages/me/index')
            }
        },
        methods: {
            gotoForget() {
                this.$utils.redirect('/pages/account/forget')
            },
            gotoRegister() {
                this.$utils.redirect('/pages/account/register')
            },
            hideCaptchaModal() {
                this.showCaptchaModal = false
            },
            verifyCodeChange(text) {
                this.verifyCodeTips = text
            },
            getVerifyCaptcha() {
                if (!this.$refs.verifyCode.canGetCode) {
                    return false
                }
                this.captchaRand = ''
                this.showCaptchaModal = true
                this.$api.getVerifyCaptcha().then(res => {
                    this.captchaImage = res.captcha
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            sendSmsVerifyCode() {
                this.$api.sendSmsVerifyCode({
                    phone: this.vl.account,
                    ticket: this.captchaImage.ticket,
                    rand: this.captchaRand,
                }).then(res => {
                    this.$u.toast('已发送验证码')
                    this.$refs.verifyCode.start()
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            loginByPassword() {
                this.$refs.pl.validate(valid => {
                    if (valid) {
                        this.$api.loginByPassword({
                            account: this.pl.account,
                            password: this.pl.password
                        }).then(res => {
                            console.log(this.redirectUrl)
                            this.$utils.setToken(res.token)
                            this.$utils.redirect(this.redirectUrl)
                        }).catch(e => {
                            this.$u.toast(e.msg)
                        })
                    }
                })
            },
            loginByVerify() {
                this.$refs.vl.validate(valid => {
                    if (valid) {
                        this.$api.loginByVerify({
                            account: this.vl.account,
                            verify_code: this.vl.verify_code
                        }).then(res => {
                            this.$utils.setToken(res.token)
                            this.$utils.redirect(this.redirectUrl)
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
    .captcha-box {
        padding: 80rpx 30rpx 0 30rpx;
    }

    .captcha-box .img {
        display: flex;
        justify-content: center;
        margin-bottom: 10rpx;
    }
</style>