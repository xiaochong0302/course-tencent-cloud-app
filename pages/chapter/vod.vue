<template>
    <view v-if="chapter.id > 0">
        <view class="chapter">
            <u-sticky :enable="enableSticky" h5-nav-height="0">
                <view class="player">
                    <video :src="playUrl" :poster="chapter.course.cover" @play="playHandler" @pause="pauseHandler" @ended="endedHandler"
                        @timeupdate="timeUpdateHandler" @error="errorHandler"></video>
                </view>
                <view class="title u-line-1">{{ chapter.title }}</view>
            </u-sticky>
        </view>
        <view class="chapter-stat u-border-bottom">
            <view class="left">{{ chapter.comment_count|humanNumber }} 评论</view>
            <view class="right">{{ chapter.like_count|humanNumber}} 点赞</view>
        </view>
        <view class="comment-wrap">
            <view class="comment-list" v-if="commentList.items.length > 0">
                <comment-list :items="commentList.items" v-on:commentDeleted="commentDeleted"></comment-list>
            </view>
            <u-loadmore :status="commentList.loadMore" v-if="commentList.items.length > 0"></u-loadmore>
            <u-empty :show="commentList.showEmpty" margin-top="100"></u-empty>
        </view>
        <view class="fixbar-padding"></view>
        <view class="fixbar">
            <view class="left">
                <u-icon name="chat" size="36" :label="chapter.comment_count|humanNumber"></u-icon>
                <u-icon name="account" size="36" :label="chapter.user_count|humanNumber"></u-icon>
                <u-icon :name="likeIcon.name" size="36" :color="likeIcon.color" :label="chapter.like_count|humanNumber" @click="toggleLike"></u-icon>
            </view>
            <view class="right">
                <u-button size="mini" @click="openCommentBox">评论</u-button>
            </view>
        </view>
        <u-popup v-model="showCommentBox" mode="bottom" :closeable="false">
            <view class="comment-box">
                <view class="header u-border-top u-border-bottom">
                    <text @click="closeCommentBox">取消</text>
                    <text @click="createComment">发送</text>
                </view>
                <textarea class="textarea" v-model="myComment" :auto-height="true" placeholder="请输入评论内容"></textarea>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import CommentList from '@/components/comment-list.vue'
    export default {
        components: {
            CommentList
        },
        data() {
            return {
                enableSticky: true,
                playUrl: '',
                chapter: {
                    course: {},
                    me: {},
                },
                learning: {
                    interval: null,
                    interval_time: 15000,
                    request_id: this.$u.guid(16),
                    plan_id: 0,
                    position: 0,
                },
                commentList: {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                    showEmpty: false,
                },
                showCommentBox: false,
                myComment: '',
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
            this.loadComments(e.id)
        },
        onReachBottom() {
            if (this.commentList.hasMore) {
                this.loadComments(this.chapter.id)
            }
        },
        onShow() {
            this.enableSticky = true
        },
        onHide() {
            this.enableSticky = false
        },
        methods: {
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
            getPlayUrl() {
                let playUrls = this.chapter.play_urls
                if (playUrls.sd) {
                    return playUrls.sd.url
                }
                if (playUrls.hd) {
                    return playUrls.hd.url
                }
                if (playUrls.od) {
                    return playUrls.od.url
                }
                return ''
            },
            getCurrentUrl() {
                return `/pages/chapter/vod?id=${this.chapter.id}`
            },
            openCommentBox() {
                this.$utils.checkLogin({
                    redirect: this.getCurrentUrl(),
                    success: () => {
                        this.showCommentBox = true
                    }
                })
            },
            closeCommentBox() {
                this.showCommentBox = false
            },
            commentDeleted(e) {
                this.chapter.comment_count--
            },
            createComment() {
                let params = {
                    item_type: 1,
                    item_id: this.chapter.id,
                    content: this.myComment,
                }
                if (params.content.length < 3) {
                    return false
                }
                this.$api.createComment(params).then(res => {
                    this.commentList.items.unshift(res.comment)
                    this.chapter.comment_count++
                    this.showCommentBox = false
                    this.myComment = ''
                    this.$u.toast('发送评论成功')
                }).catch(e => {
                    this.$u.toast(e.msg)
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
                if (this.chapter.me.logged == 0) {
                    return false
                }
                this.$api.learningChapter(this.chapter.id, {
                    plan_id: this.learning.plan_id,
                    request_id: this.learning.request_id,
                    interval_time: this.learning.interval_time,
                    position: this.learning.position,
                }).catch(e => {
                    console.log(e.msg)
                })
            },
            loadChapter(id) {
                this.$api.getChapterInfo(id).then(res => {
                    if (res.chapter.me.owned == 0) {
                        this.$u.toast('没有浏览权限')
                        return false
                    }
                    this.chapter = res.chapter
                    this.learning.plan_id = res.chapter.me.plan_id
                    this.learning.position = res.chapter.me.position
                    this.playUrl = this.getPlayUrl()
                    console.log('playUrl:' + this.playUrl)
                }).catch(e => {
                    this.$u.toast('加载课时失败')
                })
            },
            loadComments(id) {
                let params = {}
                if (this.commentList.page > 0) {
                    params.page = this.commentList.page
                }
                this.$api.getChapterComments(id, params).then(res => {
                    this.commentList.items = this.commentList.items.concat(res.pager.items)
                    this.commentList.hasMore = res.pager.total_pages > this.commentList.page
                    this.commentList.loadMore = this.commentList.hasMore ? 'loadmore' : 'nomore'
                    this.commentList.showEmpty = this.commentList.page == 1 && res.pager.total_pages == 0
                    this.commentList.page++
                }).catch(e => {
                    this.$u.toast('加载评论失败')
                })
            }
        }
    }
</script>

<style>
    .container {
        padding: 0;
    }

    .player,
    video {
        width: 750rpx;
        height: 422rpx;
    }

    .chapter {
        background-color: white;
    }

    .chapter .title {
        color: $u-main-color;
        background-color: white;
        font-weight: 600;
        padding: 20rpx;
    }

    .chapter-stat {
        display: flex;
        justify-content: space-between;
        padding: 0 20rpx 20rpx 20rpx;
        margin-bottom: 30rpx;
    }

    .chapter-stat .left {
        color: $u-main-color;
    }

    .chapter-stat .right {
        color: $u-tips-color;
    }

    .comment-list {
        padding: 20rpx;
    }

    .fixbar-padding {
        height: 120rpx;
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

    .comment-box .header {
        display: flex;
        justify-content: space-between;
        padding: 15rpx 20rpx;
    }

    .comment-box .textarea {
        padding: 20rpx;
        width: 710rpx;
        min-height: 120rpx;
    }
</style>