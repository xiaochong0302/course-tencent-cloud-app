<template>
	<view class="container">
		<view class="section">
			<u-section title="商品信息" :right="false"></u-section>
			<view class="item-course" v-if="confirm.item_type== 1">
				<view class="course">
					<view class="title">课程 - {{ itemInfo.course.title }}</view>
					<view class="meta">
						<text>学习期限：{{ itemInfo.course.study_expiry }}个月</text>
						<text>退款期限：{{ itemInfo.course.refund_expiry }}个月</text>
					</view>
					<view class="meta">
						<text>市场价格：{{ itemInfo.course.market_price|formatPrice }}</text>
						<text>会员价格：{{ itemInfo.course.vip_price|formatPrice }}</text>
					</view>
					<view class="meta">
						<text>退款金额：{{ itemInfo.course.refund_amount|formatPrice }}</text>
						<text>退款比例：{{ 100 * itemInfo.course.refund_percent }}%</text>
					</view>
				</view>
			</view>
			<view class="item-package" v-else-if="confirm.item_type== 2">
				<view class="course" v-for="course in itemInfo.package.courses" :key="course.id">
					<view class="title">课程 - {{ course.title }}</view>
					<view class="meta">
						<text>学习期限：{{ course.study_expiry }}个月</text>
						<text>退款期限：{{ course.refund_expiry }}个月</text>
					</view>
					<view class="meta">
						<text>市场价格：{{ course.market_price|formatPrice }}</text>
						<text>会员价格：{{ course.vip_price|formatPrice }}</text>
					</view>
					<view class="meta">
						<text>退款金额：{{ course.refund_amount|formatPrice }}</text>
						<text>退款比例：{{ 100 * course.refund_percent }}%</text>
					</view>
				</view>
			</view>
		</view>
		<view class="section">
			<u-section title="支付信息" :right="false"></u-section>
			<view class="stats">
				<view class="meta">订单金额：{{ order.amount|formatPrice }}</view>
				<view class="meta">退款金额：{{ confirm.refund_amount|formatPrice }}</view>
			</view>
		</view>
		<u-form :model="form" ref="form" :error-type="['toast']">
			<u-form-item label="退款理由" label-position="top" prop="apply_note">
				<u-input v-model="form.apply_note" type="textarea" maxlength="255"></u-input>
			</u-form-item>
			<view class="form-item">
				<u-button type="primary" @click="createRefund">提交申请</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: {},
				confirm: {},
				itemInfo: {
					course: {},
					package: []
				},
				form: {
					apply_note: ''
				},
				rules: {
					apply_note: [{
						required: true,
						message: '请填写退款理由'
					}, {
						min: 10,
						max: 255,
						message: '退款理由10-255个字符'
					}]
				},
				disabled: false
			}
		},
		onLoad(e) {
			this.loadOrderInfo(e.sn)
			this.loadRefundConfirm(e.sn)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			loadOrderInfo(sn) {
				this.$api.getOrderInfo(sn).then(res => {
					this.order = res.order
				}).catch(e => {
					this.$u.toast('加载订单失败')
				})
			},
			loadRefundConfirm(sn) {
				this.$api.getRefundConfirm(sn).then(res => {
					this.confirm = res.confirm
					this.itemInfo = res.confirm.item_info
				}).catch(e => {
					this.$u.toast('加载信息失败')
				})
			},
			createRefund() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.disabled = true
						uni.showLoading({
							title: '提交中...',
							mask: true
						})
						this.$api.createRefund({
							order_sn: this.order.sn,
							apply_note: this.form.apply_note,
						}).then(res => {
							uni.hideLoading()
							this.$utils.redirect('/pages/me/refunds')
						}).catch(e => {
							uni.hideLoading()
							this.disabled = false
							this.$u.toast('提交退款失败')
						})
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
	}

	.u-section {
		margin-bottom: 30rpx;
	}

	.section {
		margin-bottom: 30rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}

	.course {
		margin-bottom: 20rpx;
		border-bottom: 1px solid #e4e7ed;
	}

	.course .title {
		margin-bottom: 15rpx;
	}

	.course .meta {
		margin-bottom: 15rpx;
	}

	.item-reward .title {
		margin-bottom: 15rpx;
	}

	.item-vip .title {
		margin-bottom: 15rpx;
	}

	.stats .meta {
		margin-bottom: 15rpx;
	}
</style>
