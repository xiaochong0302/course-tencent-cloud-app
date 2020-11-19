<template>
	<view class="container">
		<u-form :model="profile" ref="profile" :error-type="['message']">
			<u-form-item label="头像">
				<u-image width="90" height="90" border-radius="100%" :src="profile.avatar|thumbAvatar" @click="changeAvatar"></u-image>
			</u-form-item>
			<u-form-item label="昵称" prop="name">
				<u-input v-model="profile.name" maxlength="15" placeholder="请输入昵称"></u-input>
			</u-form-item>
			<u-form-item label="性别">
				<u-radio-group v-model="gender.name" @change="changeGender">
					<u-radio v-for="(item,index) in gender.options" :key="index" :name="item.name">{{ item.name }}</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="简介" label-position="top" prop="about">
				<u-input v-model="profile.about" type="textarea" maxlength="15" placeholder="请输入简介"></u-input>
			</u-form-item>
			<view class="form-item hide">
				<u-input v-model="profile.avatar"></u-input>
			</view>
			<view class="form-item">
				<u-button type="primary" @click="submit">提交</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: {},
				gender: {
					name: '男',
					value: 1,
					options: [{
						name: '男'
					}, {
						name: '女'
					}, {
						name: '保密'
					}]
				},
				rules: {
					name: [{
						required: true,
						message: '请填写昵称'
					}, {
						min: 2,
						max: 15,
						message: '昵称2-15个字符'
					}],
					about: [{
						min: 10,
						max: 255,
						message: '简介10-255个字符'
					}]
				}
			}
		},
		onLoad() {
			this.loadMyProfile()
		},
		onReady() {
			this.$refs.profile.setRules(this.rules)
		},
		methods: {
			changeGender(name) {
				this.gender.value = this.getGenderValueByName(name)
			},
			changeAvatar() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const filePath = res.tempFilePaths[0]
						this.$api.uploadAvatar(filePath).then(res => {
							let myRes = JSON.parse(res.data)
							if (myRes.code == 0) {
								this.profile.avatar = myRes.data.src
							} else {
								this.$u.toast(myRes.msg)
							}
						})
					}
				})
			},
			submit() {
				this.$refs.profile.validate(valid => {
					if (valid) {
						this.$api.updateMyProfile({
							name: this.profile.name,
							gender: this.gender.value,
							avatar: this.profile.avatar,
							about: this.profile.about
						}).then(res => {
							this.$u.toast('更新资料成功')
						}).catch(e => {
							this.$u.toast('更新资料失败')
						})
					}
				})
			},
			getGenderValueByName(name) {
				switch (name) {
					case '男':
						return 1
						break
					case '女':
						return 2
						break
					default:
						return 3
						break
				}
			},
			getGenderNameByValue(value) {
				switch (value) {
					case 1:
						return '男'
						break
					case 2:
						return '女'
						break
					default:
						return '保密'
						break
				}
			},
			loadMyProfile() {
				this.$api.getMyProfile().then(res => {
					this.profile = res.profile
					this.gender.name = this.getGenderNameByValue(res.profile.gender)
				}).catch(e => {
					this.$u.toast('获取资料失败')
				})
			}
		}
	}
</script>

<style>

</style>
