<template>
    <view>
        <view class="item-list" v-if="comments.length > 0">
            <view class="item" v-for="(comment,index) in comments" :key="comment.id">
                <view class="avatar" @click="gotoUser(comment.owner.id)">
                    <u-avatar size="mini" :src="comment.owner.avatar|thumbAvatar" :show-level="comment.owner.vip == 1">
                    </u-avatar>
                </view>
                <view class="info">
                    <view class="header">
                        <view class="name" @click="gotoUser(comment.owner.id)">{{ comment.owner.name }}</view>
                        <view class="like">
                            <u-icon :index="index" :name="comment.like_icon.name" :color="comment.like_icon.color" :label="comment.like_count"
                                @click="toggleLike"></u-icon>
                        </view>
                    </view>
                    <view class="body" @click="popupReplies(index,comment.id)">{{ comment.content }}</view>
                    <view class="footer">
                        <view class="left">
                            <text @click="popupReplies(index,comment.id)">{{ comment.reply_count }} 回复</text>
                            <text>{{ comment.create_time|timeFrom }}</text>
                        </view>
                        <view class="right">
                            <text @click="deleteConfirm(index)" v-if="comment.me.owned == 1">删除</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <u-popup v-model="showReplyList" mode="bottom" height="100%" :closeable="true" v-if="replyComment">
            <view class="comment-stat">{{ replyComment.reply_count }} 回复</view>
            <scroll-view scroll-y="true" class="scroll-reply" @scrolltolower="scrollToLower">
                <reply-list :items="replyList.items" v-on:replyDeleted="replyDeleted" v-on:userReplied="userReplied"></reply-list>
                <u-loadmore :status="replyList.loadMore" v-if="replyList.items.length > 0"></u-loadmore>
            </scroll-view>
            <view class="comment-box">
                <view class="header u-border-top u-border-bottom">
                    <text @click="clearReply">清空</text>
                    <text>回复</text>
                    <text @click="createReply">发送</text>
                </view>
                <textarea class="textarea" v-model="myReply" auto-height="true" :placeholder="replyPlaceholder"></textarea>
            </view>
        </u-popup>
        <u-modal v-model="showDeleteComfirm" :show-cancel-button="true" @confirm="deleteComment" content="确定要删除吗？">
        </u-modal>
    </view>
</template>

<script>
    import ReplyList from '@/components/reply-list.vue'
    export default {
        components: {
            ReplyList
        },
        name: 'CommentList',
        props: {
            items: {
                type: Array
            }
        },
        data() {
            return {
                comments: [],
                replyList: {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                },
                showReplyList: false,
                showDeleteComfirm: false,
                currentCommentIndex: 0,
                replyPlaceholder: '请输入回复内容',
                replyCommentIndex: 0,
                replyCommentId: 0,
                myReply: '',
            }
        },
        computed: {
            replyComment: function() {
                let index = this.replyCommentIndex
                let comment = this.comments[index]
                return this.comments[index]
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
            toggleLike(index) {
                let id = this.getIdByIndex(index)
                this.$api.likeComment(id).then(res => {
                    if (this.comments[index].me.liked == 0) {
                        this.comments[index].me.liked = 1
                        this.comments[index].like_count++
                    } else {
                        this.comments[index].me.liked = 0
                        this.comments[index].like_count--
                    }
                    this.comments[index].like_icon = this.getLikeIcon(this.comments[index].me.liked)
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            deleteConfirm(index) {
                this.showDeleteComfirm = true
                this.currentCommentIndex = index
            },
            deleteComment() {
                let index = this.currentCommentIndex
                let id = this.getIdByIndex(index)
                this.$api.deleteComment(id).then(res => {
                    this.comments.splice(index, 1)
                    this.$emit('commentDeleted')
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            scrollToLower() {
                if (this.replyList.hasMore) {
                    this.loadReplies(this.replyCommentId)
                }
            },
            userReplied(e) {
                this.replyCommentId = e.replyId
                this.replyPlaceholder = `回复 ${e.replyUser.name}：`
            },
            replyDeleted(e) {
                let index = this.replyCommentIndex
                this.comments[index].reply_count--
            },
            createReply() {
                let index = this.replyCommentIndex
                let id = this.replyCommentId
                let params = {
                    content: this.myReply
                }
                if (params.content.length < 3) return false
                this.$api.replyComment(id, params).then(res => {
                    this.replyList.items.unshift(res.comment)
                    this.comments[index].reply_count++
                    this.myReply = ''
                    this.$u.toast('发送回复成功')
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            clearReply() {
                this.myReply = ''
            },
            popupReplies(commentIndex, commentId) {
                this.replyList = {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                }
                this.loadReplies(commentId)
                this.showReplyList = true
                this.replyCommentIndex = commentIndex
                this.replyCommentId = commentId
            },
            loadReplies(commentId) {
                let params = {}
                if (this.replyList.page > 0) {
                    params.page = this.replyList.page
                }
                this.$api.getCommentReplies(commentId, params).then(res => {
                    this.replyList.items = this.replyList.items.concat(res.pager.items)
                    this.replyList.hasMore = res.pager.total_pages > this.replyList.page
                    this.replyList.loadMore = this.replyList.hasMore ? 'loadmore' : 'nomore'
                    if (this.replyList.hasMore) this.replyList.page++
                }).catch(e => {
                    this.$u.toast('加载评论失败')
                })
            },
            getIdByIndex(index) {
                return this.comments[index].id
            },
            getLikeIcon(liked) {
                return {
                    name: liked == 1 ? 'thumb-up-fill' : 'thumb-up',
                    color: liked == 1 ? 'red' : '',
                }
            },
            handleComments(items) {
                return items.map(item => {
                    item.like_icon = this.getLikeIcon(item.me.liked)
                    return item
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
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

    .header .name {
        color: $u-main-color;
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

    .comment-stat {
        color: $u-main-color;
        padding: 30rpx 20rpx 20rpx 20rpx;
    }

    .scroll-reply {
        height: 80%;
    }

    .u-load-more-wrap {
        padding-bottom: 100rpx;
    }

    .comment-box {
        left: 0;
        right: 0;
        bottom: 0;
        position: fixed;
        z-index: 9;
        background-color: white;
    }

    .comment-box .header {
        display: flex;
        justify-content: space-between;
        background-color: white;
        padding: 15rpx 20rpx;
    }

    .comment-box .textarea {
        padding: 20rpx;
        width: 710rpx;
        min-height: 120rpx;
    }
</style>
