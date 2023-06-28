<template>
	<view>
		<view class="item-list">
			<view class="item" v-for="(comment,index) in comments" :key="comment.id">
				<view class="avatar" @click="gotoUser(comment.owner.id)">
					<u-avatar size="mini" :src="comment.owner.avatar|thumbAvatar" :show-level="comment.owner.vip == 1">
					</u-avatar>
				</view>
				<view class="info">
					<view class="header">
						<view class="user" v-if="comment.to_user.id > 0">
							<text class="name" @click="gotoUser(comment.owner.id)">{{ comment.owner.name }}</text>
							<text class="reply">回复</text>
							<text class="name" @click="gotoUser(comment.to_user.id)">{{ comment.to_user.name }}</text>
						</view>
						<view class="user" v-else>
							<text class="name" @click="gotoUser(comment.owner.id)">{{ comment.owner.name }}</text>
						</view>
						<view class="like">
							<u-icon :index="index" :name="comment.like_icon.name" :color="comment.like_icon.color"
								:label="comment.like_count" @click="likeComment"></u-icon>
						</view>
					</view>
					<view class="body">{{ comment.content }}</view>
					<view class="footer">
						<view class="left">
							<text @click="replyUser(index)">回复</text>
							<text>{{ comment.create_time|timeFrom }}</text>
						</view>
						<view class="right">
							<text @click="deleteComment(index)" v-if="comment.me.owned == 1">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="showDeleteComfirm" :show-cancel-button="true" @confirm="deleteConfirm" content="确定要删除吗？">
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: 'ReplyList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				comments: [],
				showDeleteComfirm: false,
				currentCommentIndex: null,
			}
		},
		created() {
			this.comments = this.handleComments(this.items)
		},
		watch: {
			items: function() {
				this.comments = this.handleComments(this.items)
			}
		},
		methods: {
			gotoUser(id) {
				this.$utils.redirect('/pages/user/index', {
					id: id
				})
			},
			replyUser(index) {
				let id = this.getIdByIndex(index)
				let user = this.getUserByIndex(index)
				this.$emit('userReplied', {
					replyId: id,
					replyUser: user
				})
			},
			likeComment(index) {
				let id = this.getIdByIndex(index)
				this.$api.likeComment(id).then(res => {
					if (res.data.action == 'do') {
						this.comments[index].like_icon = {
							name: 'thumb-up-fill',
							color: 'red'
						}
						this.comments[index].like_count++
					} else {
						this.comments[index].like_icon = {
							name: 'thumb-up',
							color: ''
						}
						this.comments[index].like_count--
					}
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			deleteComment(index) {
				this.showDeleteComfirm = true
				this.currentCommentIndex = index
			},
			deleteConfirm() {
				let index = this.currentCommentIndex
				let id = this.getIdByIndex(index)
				this.$api.deleteComment(id).then(res => {
					this.comments.splice(index, 1)
					this.$emit('replyDeleted')
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			getIdByIndex(index) {
				return this.comments[index].id
			},
			getUserByIndex(index) {
				return this.comments[index].owner
			},
			handleComments(items) {
				return items.map(item => {
					item.like_icon = {
						name: item.me.liked == 1 ? 'thumb-up-fill' : 'thumb-up',
						color: item.me.liked == 1 ? 'red' : '',
					}
					return item
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.item-list {
		padding: 20rpx;
	}

	.item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.item .avatar {
		margin-right: 20rpx;
	}

	.item .info {
		flex: 1;
	}

	.item .header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.header .user .name {
		color: $u-main-color;
	}
	
	.header .user .reply {
		color: $u-tips-color;
		margin: 0 15rpx;
	}

	.item .body {
		color: $u-content-color;
		word-break: break-word;
		margin-bottom: 20rpx;
	}

	.item .footer {
		display: flex;
		justify-content: space-between;
		color: $u-tips-color;
	}

	.footer .left text {
		margin-right: 30rpx;
	}
</style>
