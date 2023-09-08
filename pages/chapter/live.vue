<template>
    <view class="container" v-if="chapter.id > 0">
        <view class="active" v-if="chapter.status == 1">
            <view class="chapter">
                <u-sticky :enable="enableSticky" h5-nav-height="0">
                    <view class="player">
                        <video :src="playUrl" :autoplay="true" :is-live="true" @play="playHandler" @pause="pauseHandler" @ended="endedHandler"
                            @timeupdate="timeUpdateHandler" @error="errorHandler"></video>
                    </view>
                </u-sticky>
            </view>
            <scroll-view class="chat-list" :scroll-y="true" :scroll-into-view="scrollIntoView">
                <view class="chat" v-for="(chat,index) in chats" :key="chat.id" :id="'id-'+index">
                    <u-icon name="level" color="orange" v-if="chat.user.vip == 1"></u-icon>
                    <text class="name">{{ chat.user.name }}</text>
                    <text class="content">{{ chat.content }}</text>
                </view>
            </scroll-view>
            <view class="fixbar">
                <view class="left">
                    <u-icon name="account" size="36" :label="stats.user_count|humanNumber"></u-icon>
                    <u-icon :name="likeIcon.name" size="36" :color="likeIcon.color" :label="chapter.like_count|humanNumber" @click="toggleLike"></u-icon>
                </view>
                <view class="right">
                    <u-button size="mini" @click="popupChatBox">参与讨论</u-button>
                </view>
            </view>
            <u-popup v-model="showChatBox" mode="bottom" :closeable="false">
                <view class="chat-box">
                    <view class="header u-border-top u-border-bottom">
                        <text @click="clearMessage">清空</text>
                        <text @click="sendMessage">发送</text>
                    </view>
                    <textarea class="textarea" v-model="myMessage" :auto-height="true" placeholder="请输入讨论内容"></textarea>
                </view>
            </u-popup>
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
    export default {
        data() {
            return {
                enableSticky: true,
                scrollIntoView: 'id-0',
                countdownTime: 0,
                playUrl: '',
                chapter: {
                    me: {}
                },
                stats: {
                    user_count: 0,
                },
                learning: {
                    interval: null,
                    interval_time: 15000,
                    request_id: this.$u.guid(16),
                    plan_id: 0,
                },
                chats: [],
                showChatBox: false,
                myMessage: '',
            }
        },
        computed: {
            likeIcon: function() {
                let liked = this.chapter.me.liked == 1
                return {
                    name: liked ? 'thumb-up-fill' : 'thumb-up',
                    color: liked ? 'red' : '',
                }
            }
        },
        onLoad(e) {
            this.loadChapter(e.id)
            this.loadChats(e.id)
        },
        onShow() {
            this.enableSticky = true
        },
        onHide() {
            this.enableSticky = false
        },
        methods: {
            initSocket() {
                this.$api.getSocketInfo().then(res => {
                    let that = this
                    let socket = res.socket
                    uni.connectSocket({
                        url: socket.connect_url
                    })
                    uni.onSocketOpen(res => {
                        console.log('socket open')
                        let intervalTime = 1000 * socket.ping_interval
                        setInterval(() => {
                            uni.sendSocketMessage({
                                data: 'ping'
                            })
                            console.log('ping...')
                        }, intervalTime)
                    })
                    uni.onSocketClose(res => {
                        console.log('socket close')
                    })
                    uni.onSocketError(res => {
                        console.log('socket error')
                    })
                    uni.onSocketMessage(res => {
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
            playHandler() {
                this.setLearningInterval()
            },
            pauseHandler() {
                this.clearLearningInterval()
            },
            endedHandler() {
                this.clearLearningInterval()
                this.learningChapter()
            },
            errorHandler(e) {
                console.log(e.target)
            },
            timeUpdateHandler(e) {
                this.learning.position = e.detail.currentTime
            },
            stateChangeHandler(e) {
                console.log('live player code:' + e.detail.code)
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
            setLiveStatsInterval() {
                setInterval(this.loadLiveStats, 30000)
            },
            getPlayUrl() {
                let urls = this.chapter.play_urls.m3u8
                if (urls.sd) {
                    return urls.sd
                }
                if (urls.hd) {
                    return urls.hd
                }
                if (urls.od) {
                    return urls.od
                }
                return ''
            },
            getCurrentUrl() {
                return `/pages/chapter/live?id=${this.chapter.id}`
            },
            showLoginMessage(data) {
                this.chats.push({
                    id: data.id,
                    content: '进入了直播间',
                    user: data.user,
                })
                this.setScrollIntoView()
            },
            showNewMessage(data) {
                this.chats.push({
                    id: data.id,
                    content: data.content,
                    user: data.user,
                })
                this.setScrollIntoView()
            },
            setScrollIntoView() {
                setTimeout(() => {
                    this.scrollIntoView = 'id-' + (this.chats.length - 1)
                }, 500)
            },
            popupChatBox() {
                this.showChatBox = !this.showChatBox
            },
            clearMessage() {
                this.myMessage = ''
            },
            bindUser(data) {
                this.$api.bindLiveUser(this.chapter.id, {
                    client_id: data.client_id
                }).then(res => {
                    console.log('bind user ok')
                }).catch(e => {
                    this.$u.toast('绑定用户失败')
                })
            },
            sendMessage() {
                let content = this.$u.trim(this.myMessage)
                if (content.length < 1) {
                    return false
                }
                this.$api.sendLiveMessage(this.chapter.id, {
                    content: content
                }).then(res => {
                    this.showChatBox = false
                    this.showNewMessage(res.message)
                    this.myMessage = ''
                }).catch(e => {
                    this.$u.toast('发送消息失败')
                })
            },
            toggleLike() {
                this.$utils.checkLogin({
                    redirect: this.getCurrentUrl(),
                    success: () => {
                        this.$api.likeChapter(this.chapter.id).then(res => {
                            if (this.chapter.me.liked == 0) {
                                this.chapter.me.liked = 1
                                this.chapter.like_count++
                            } else {
                                this.chapter.me.liked = 0
                                this.chapter.like_count--
                            }
                        }).catch(e => {
                            this.$u.toast(e.msg)
                        })
                    }
                })
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
            loadChapter(id) {
                this.$api.getChapterInfo(id).then(res => {
                    if (res.chapter.status == 1) {
                        if (res.chapter.me.owned == 0) {
                            this.$u.toast('没有浏览权限')
                            return false
                        }
                        this.initSocket()
                    }
                    this.chapter = res.chapter
                    this.countdownTime = res.chapter.start_time - this.$utils.getNowTime()
                    this.settings.chat_enabled = res.chapter.settings.chat_enabled
                    this.learning.plan_id = res.chapter.me.plan_id
                    this.playUrl = this.getPlayUrl()
                }).catch(e => {
                    this.$u.toast('加载课时失败')
                })
            },
            loadChats(id) {
                this.$api.getLiveChats(id).then(res => {
                    this.chats = res.chats
                }).catch(e => {
                    this.$u.toast('加载聊天失败')
                })
            },
            loadLiveStats(id) {
                this.$api.getLiveStats(id).then(res => {
                    this.stats = res.stats
                }).catch(e => {
                    this.$u.toast('加载统计失败')
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
        padding-top: 50rpx;
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

    .player,
    video {
        width: 750rpx;
        height: 422rpx;
    }

    .chapter {
        background-color: white;
    }

    .chat-list {
        width: 710rpx;
        height: 650rpx;
        padding: 20rpx;
    }

    .chat {
        margin-bottom: 20rpx;
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

    .fixbar {
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9;
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        padding: 20rpx;
    }

    .fixbar .right .u-btn,
    .fixbar .right u-button {
        margin-left: 20rpx;
    }

    .fixbar .left .u-icon,
    .fixbar .left u-icon {
        margin-right: 30rpx;
    }

    .chat-box .header {
        display: flex;
        justify-content: space-between;
        padding: 15rpx 20rpx;
    }

    .chat-box .textarea {
        padding: 20rpx;
        width: 710rpx;
        min-height: 120rpx;
    }
</style>