<template>
	<view class="container">
		<u-cell-group>
			<u-cell-item title="我的订单" index="order" :arrow="true" @click="gotoPage"></u-cell-item>
			<u-cell-item title="我的退款" index="refund" :arrow="true" @click="gotoPage"></u-cell-item>
			<u-cell-item title="我的课程" index="course" :arrow="true" @click="gotoPage"></u-cell-item>
			<u-cell-item title="我的收藏" index="favorite" :arrow="true" @click="gotoPage"></u-cell-item>
			<u-cell-item title="我的咨询" index="consult" :arrow="true" @click="gotoPage"></u-cell-item>
			<u-cell-item title="我的评价" index="review" :arrow="true" @click="gotoPage"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: {}
			}
		},
		onLoad() {
			this.loadMyProfile()
		},
		methods: {
			gotoPage(index) {
				switch (index) {
					case 'order':
						this.$utils.redirect('/pages/me/orders')
						break;
					case 'refund':
						this.$utils.redirect('/pages/me/refunds')
						break;
					case 'course':
						this.$utils.redirect('/pages/me/courses')
						break;
					case 'favorite':
						this.$utils.redirect('/pages/me/favorites')
						break;
					case 'consult':
						this.$utils.redirect('/pages/me/consults')
						break;
					case 'review':
						this.$utils.redirect('/pages/me/reviews')
						break;
				}
			},
			loadMyProfile() {
				this.$api.getMyProfile().then(res => {
					this.profile = res.profile
				}).catch(e => {
					console.error(e)
				})
			}
		}
	}
</script>

<style>
	.profile uni-image {
		border-radius: 100%;
	}
</style>
