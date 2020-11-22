<template>
	<view class="item-list">
		<view class="item" v-for="user in users" :key="user.id" @click="gotoUser(user.id)">
			<view class="avatar">
				<u-image :src="user.avatar|thumbAvatar" width="100" height="100" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="title">{{ user.name }}</view>
				<view class="meta">{{ user.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UserList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				users: []
			}
		},
		created() {
			this.users = this.handleUsers(this.items)
		},
		watch: {
			items: function() {
				this.users = this.handleUsers(this.items)
			}
		},
		methods: {
			gotoUser(id) {
				this.$utils.redirect('/pages/im/user/index', {
					id: id
				})
			},
			handleUsers(users) {
				return users.map(user => {
					if (user.title == '') {
						user.title = '小小书童'
					}
					return user
				})
			}
		}
	}
</script>

<style>
	.item-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.item {
		display: flex;
		width: 320rpx;
		margin-bottom: 50rpx;
	}

	.item .avatar {
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		color: $u-main-color;
		margin-bottom: 15rpx;
	}
	
	.info .meta {
		color: $u-tips-color;
	}
</style>
