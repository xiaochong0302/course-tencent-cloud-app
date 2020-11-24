<template>
	<view class="container" v-if="chapter.id > 0">
		<view class="active" v-if="chapter.status == 1">
			<view class="player" id="player"></view>
			<view class="u-p-15">
				<u-section :title="chapter.course.title" sub-title="详情" @click="gotoCourse(chapter.course.id)"></u-section>
			</view>
			<view class="chat-list u-p-15">
				<view class="chat" v-for="chat in chats" :key="chat.id">
					<u-icon name="level" color="orange" v-if="chat.user.vip == 1"></u-icon>
					<text class="name">{{ chat.user.name }}</text>
					<text class="content">{{ chat.content }}</text>
				</view>
			</view>
			<view class="chat-form">
				<u-form :model="form" ref="form">
					<u-form-item prop="content">
						<u-input v-model="form.content" maxlength="50" placeholder="立即参与讨论"></u-input>
						<u-button slot="right" type="success" size="mini" @click="sendMessage">发送</u-button>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="inactive" v-else-if="chapter.status == 2">
			<view class="preview" v-if="countdownTime > 0">
				<view class="icon">
					<u-icon name="clock" size="90"></u-icon>
				</view>
				<view class="timer">
					<u-count-down :timestamp="countdownTime" separator="zh"></u-count-down>
				</view>
				<view class="tips">直播倒计时开始啦，敬请关注！</view>
			</view>
			<view class="preview" v-else>
				<view class="icon">
					<u-icon name="warning" size="90"></u-icon>
				</view>
				<view class="tips">直播已结束，谢谢关注！</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		TcPlayer
	} from '@/common/tcplayer.js'
	export default {
		data() {
			return {
				countdownTime: 0,
				socketOpen: false,
				player: null,
				chapter: {
					course: {}
				},
				chats: [],
				learning: {
					interval: null,
					interval_time: 15000,
					request_id: this.$u.guid(16),
					plan_id: 0,
				},
				form: {
					content: ''
				},
				rules: {
					content: [{
						required: true,
						message: '请填写内容'
					}, {
						min: 1,
						max: 50,
						message: '内容1-50个字符'
					}]
				}
			}
		},
		onLoad(e) {
			this.loadChapter(e.id)
			this.loadChats(e.id)
		},
		onReady() {
			if (this.chapter.status == 1) {
				this.$refs.form.setRules(this.rules)
				this.initPlayer(this.chapter.play_urls)
				this.initSocket()
			}
		},
		methods: {
			initSocket() {
				this.$api.getSocketInfo().then(res => {
					let that = this
					let socket = res.socket
					uni.connectSocket({
						url: socket.connect_url
					})
					uni.onSocketOpen(function(res) {
						console.log('socket open')
						this.socketOpen = true
						let intervalTime = 1000 * socket.ping_interval
						setInterval(function() {
							uni.sendSocketMessage({
								data: 'ping'
							})
						}, intervalTime)
					})
					uni.onSocketClose(function(res) {
						console.log('socket close')
					})
					uni.onSocketError(function(res) {
						console.log('socket error')
					})
					uni.onSocketMessage(function(res) {
						let data = JSON.parse(res.data)
						if (data.type == 'bind_user') {
							that.bindUser(data)
						} else if (data.type == 'new_user') {
							that.showLoginMessage(data)
						} else if (data.type == 'new_message') {
							that.showNewMessage(data)
						}
					})
				}).catch(e => {
					this.$u.toast('获取socket地址失败')
				})
			},
			initPlayer(playUrls) {
				let options = {}
				let sys = uni.getSystemInfoSync()
				options.width = sys.windowWidth
				options.height = Math.ceil(sys.windowWidth * 9 / 16)
				if (playUrls.m3u8.od) {
					options.m3u8 = playUrls.m3u8.od
				}
				if (playUrls.m3u8.hd) {
					options.m3u8_hd = playUrls.m3u8.hd
				}
				if (playUrls.m3u8.sd) {
					options.m3u8_sd = playUrls.m3u8.sd
				}
				options.live = true
				options.autoplay = true
				options.listener = (msg) => {
					if (msg.type == 'play') {
						this.onStart()
					} else if (msg.type == 'pause') {
						this.onStop()
					} else if (msg.type == 'ended') {
						this.onStop()
					}
				}
				this.player = new TcPlayer('player', options)
			},
			onStart() {
				this.setLearningInterval()
			},
			onStop() {
				this.clearLearningInterval()
			},
			setLearningInterval() {
				this.clearLearningInterval()
				this.learning.interval = setInterval(this.learningChapter, this.learning.interval_time)
			},
			clearLearningInterval() {
				if (this.learning.interval != null) {
					clearInterval(this.learning.interval)
					this.learning.interval = null
				}
			},
			learningChapter() {
				this.$api.learningChapter(this.chapter.id, {
					plan_id: this.learning.plan_id,
					request_id: this.learning.request_id,
					interval_time: this.learning.interval_time,
				}).catch(e => {
					console.log(e.msg)
				})
			},
			bindUser(data) {
				this.$api.bindLiveUser(this.chapter.id, {
					client_id: data.client_id
				}).then(res => {

				}).catch(e => {
					this.$u.toast('绑定用户失败')
				})
			},
			showLoginMessage(data) {
				this.chats.push({
					id: data.id,
					content: '进入了直播间',
					user: data.user,
				})
			},
			showNewMessage(data) {
				this.form.content = ''
				this.chats.push({
					id: data.id,
					content: data.content,
					user: data.user,
				})
			},
			sendMessage() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.$api.sendLiveMessage(this.chapter.id, {
							content: this.form.content
						}).then(res => {
							this.showNewMessage(res.message)
						}).catch(e => {
							this.$u.toast('发送消息失败')
						})
					}
				})
			},
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			},
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.learning.plan_id = res.chapter.me.plan_id
					this.countdownTime = res.chapter.start_time - this.$utils.getNowTime()
				}).catch(e => {
					this.$u.toast('加载课时失败')
				})
			},
			loadChats(id) {
				this.$api.getLiveChats(id).then(res => {
					this.chats = this.handleChats(res.chats)
				}).catch(e => {
					this.$u.toast('加载聊天失败')
				})
			},
			handleChats(chats) {
				return chats.map(chat => {
					chat.id = this.$u.guid()
					return chat
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0;
	}
	
	.inactive {
		padding-top: 100rpx;
	}

	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.preview .icon {
		margin-bottom: 30rpx;
	}

	.preview .timer {
		margin-bottom: 30rpx;
	}

	.player {
		width: 750rpx;
		height: 422rpx;
		margin-bottom: 30rpx;
	}

	.section {
		padding: 15rpx;
		margin-bottom: 15rpx;
	}

	.chat-list {
		height: 600rpx;
		overflow-y: scroll;
		margin-bottom: 15rpx;
	}

	.chat {
		margin-bottom: 15rpx;
	}

	.chat .vip {
		color: orange;
	}

	.chat .name {
		color: $u-main-color;
		margin-left: 5rpx;
		margin-right: 15rpx;
	}
	
	.chat .content {
		color: $u-content-color;
	}

	.chat-form {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 15rpx;
	}
</style>
