<template>
    <view class="container">
        <u-form :model="form" ref="form">
            <u-form-item label="账号" prop="account">
                <u-input v-model="form.account" type="number" maxlength="11" placeholder="11位手机号码"></u-input>
            </u-form-item>
            <u-form-item label="密码" prop="password">
                <u-input v-model="form.password" type="password" maxlength="16" placeholder="6-16个字符" :password-icon="true"></u-input>
            </u-form-item>
            <u-form-item label="验证码" label-width="150" prop="verify_code">
                <u-input v-model="form.verify_code" type="number" maxlength="6" placeholder="6位短信验证码"></u-input>
                <u-button slot="right" type="success" size="mini" :disabled="verifyDisabled" @click="getVerifyCaptcha">
                    {{ verifyCodeTips }}
                </u-button>
            </u-form-item>
            <view class="form-item">
                <u-button type="primary" @click="submit">注册</u-button>
            </view>
            <view class="form-item">
                <view class="link">
                    <text @click="gotoLogin">用户登录</text>
                    <text @click="gotoForget">忘记密码</text>
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
                redirect: '/pages/me/index',
                showCaptchaModal: false,
                verifyCodeTips: '',
                captchaRand: '',
                captchaImage: {
                    ticket: '',
                    content: ''
                },
                form: {
                    account: '',
                    password: '',
                    verify_code: '',
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
        onLoad(e) {
            if (e.redirect) {
                this.redirect = e.redirect
            }
        },
        onReady() {
            this.$refs.form.setRules(this.rules)
        },
        onShow() {
            if (this.$utils.isLogin()) {
                this.$utils.redirect('/pages/me/index')
            }
        },
        methods: {
            gotoLogin() {
                this.$utils.redirect('/pages/account/login')
            },
            gotoForget() {
                this.$utils.redirect('/pages/account/forget')
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
                    phone: this.form.account,
                    ticket: this.captchaImage.ticket,
                    rand: this.captchaRand,
                }).then(res => {
                    this.$u.toast('已发送验证码')
                    this.$refs.verifyCode.start()
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            submit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$api.registerAccount({
                            account: this.form.account,
                            password: this.form.password,
                            verify_code: this.form.verify_code,
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

<style lang="scss" scoped>
    .captcha-box {
        padding: 80rpx 30rpx 0 30rpx;
    }

    .captcha-box .img {
        display: flex;
        justify-content: center;
        margin-bottom: 10rpx;
    }
</style>