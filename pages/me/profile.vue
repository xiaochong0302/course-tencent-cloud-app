<template>
	<view class="container profile-form">
		<form @submit="submit">
			<view class="form-item">
				<view class="label">头像</view>
				<view class="avatar">
					<image :src="profile.avatar|thumbAvatar" mode="aspectFit" @click="changeAvatar" />
				</view>
			</view>
			<view class="form-item">
				<view class="label">昵称</view>
				<view class="input">
					<input name="name" :value="profile.name" />
				</view>
			</view>
			<view class="form-item">
				<view class="label">性别</view>
				<view class="group">
					<radio-group @change="changeGender">
						<label>
							<radio name="gender" value="1" :checked="profile.gender===1" />男</label>
						<label>
							<radio name="gender" value="2" :checked="profile.gender===2" />女</label>
						<label>
							<radio name="gender" value="3" :checked="profile.gender===3" />密</label>
					</radio-group>
				</view>
			</view>
			<view class="form-item">
				<view class="label">简介</view>
				<view class="input">
					<textarea name="about" :value="profile.about" maxlength="255" auto-height="true" />
					</view>
			</view>
			<view class="form-item">
				<view class="action">
					<button type="primary" form-type="submit">提交</button>
				</view>
			</view>
			<view class="form-item hide">
				<input name="avatar" :value="profile.avatar" />
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: {},
				gender: 1
			}
		},
		onLoad() {
			let login = this.$utils.checkLogin('/pages/me/profile')
			if (login) {
				this.loadMyProfile()
			}
		},
		methods: {
			loadMyProfile() {
				this.$api.getMyProfile().then(res => {
					this.profile = res.profile
				}).catch(e => {
					this.$u.toast('获取资料失败')
				})
			},
			changeGender(e) {
				this.gender = e.detail.value
			},
			changeAvatar(){
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const filePath = res.tempFilePaths[0]
						this.$api.uploadAvatar(filePath).then(res => {
							let myRes = JSON.parse(res.data)
							if (myRes.code === 0) {
								this.profile.avatar = myRes.data.src
							} else {
								this.$u.toast(myRes.msg)
							}
						})
					}
				})
			},
			submit(e) {
				let data = e.detail.value
				data.gender = this.gender
				this.$api.updateMyProfile(data).then(res => {
					this.$utils.showSuccessMsg('更新资料成功')
				}).catch(e => {
					this.$u.toast('更新资料失败')
				})
			}
		}
	}
</script>

<style>
	.profile-form {
		padding-top: 50rpx;
	}
	
	.avatar uni-image {
		width:90rpx;
		height:90rpx;
		border-radius: 100%;
	}
</style>
