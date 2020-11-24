<template>
	<view class="container">
		<view class="me">
			<view class="avatar">
				<u-avatar size="large" :src="profile.avatar|thumbAvatar" @click="gotoUser(profile.id)"></u-avatar>
			</view>
			<view class="name">{{ profile.name }}</view>
		</view>
		<view class="cell-list">
			<u-cell-group>
				<u-cell-item title="我的订单" index="order" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的退款" index="refund" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的课程" index="course" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的收藏" index="favorite" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的咨询" index="consult" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的评价" index="review" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="我的资料" index="profile" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="会员中心" index="vip" :arrow="true" @click="gotoPage"></u-cell-item>
				<u-cell-item title="帮助中心" index="help" :arrow="true" @click="gotoPage"></u-cell-item>
			</u-cell-group>
		</view>
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
			gotoUser(id) {
				this.$utils.redirect(`/pages/user/index?id=${id}`)
			},
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
					case 'profile':
						this.$utils.redirect('/pages/me/profile')
						break;
					case 'vip':
						this.$utils.redirect('/pages/vip/index')
						break;
					case 'help':
						this.$utils.redirect('/pages/help/index')
						break;
				}
			},
			loadMyProfile() {
				this.$api.getMyProfile().then(res => {
					this.profile = res.profile
				}).catch(e => {
					this.$u.toast('加载资料失败')
				})
			}
		}
	}
</script>

<style>
	.me {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15rpx;
		margin-bottom: 30rpx;
	}

	.me .avatar {
		margin-bottom: 15rpx;
	}
</style>
