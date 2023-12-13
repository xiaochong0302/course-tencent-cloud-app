<template>
    <view class="container" v-if="course.id > 0">
        <view class="cover-box">
            <u-image :src="course.cover|thumbCover" width="100%" height="416"></u-image>
        </view>
        <u-sticky :enable="enableSticky" h5-nav-height="0">
            <view class="tab-title">
                <u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
            </view>
        </u-sticky>
        <view class="tab-content">
            <view class="tab-item tab-summary" v-if="currentTab == 0">
                <view class="section">
                    <view class="head">
                        <u-section title="基本信息" :right="false"></u-section>
                    </view>
                    <view class="basic">
                        <view class="title">{{ course.title }}</view>
                        <view class="meta">
                            <text>学习期限：{{ course.study_expiry }}个月</text>
                            <text>退款期限：{{ course.refund_expiry }}个月</text>
                        </view>
                        <view class="meta">
                            市场价格：<text class="price">{{ course.market_price|formatPrice }}</text>
                            会员价格：<text class="price">{{ course.vip_price|formatPrice }}</text>
                        </view>
                        <view class="meta">
                            <text>难度级别：{{ course.level|courseLevel }}</text>
                            <text>学习人次：{{ course.user_count }}</text>
                        </view>
                    </view>
                </view>
                <view class="section" v-if="course.details">
                    <view class="head">
                        <u-section title="课程介绍" :right="false"></u-section>
                    </view>
                    <view class="details ke-content">
                        <u-parse :html="course.details"></u-parse>
                    </view>
                </view>
                <view class="section" v-if="course.teacher.id > 0">
                    <view class="head">
                        <u-section title="授课教师" :right="false"></u-section>
                    </view>
                    <view class="teacher" @click="gotoTeacher(course.teacher.id)">
                        <view class="avatar">
                            <u-image width="90" height="90" shape="circle" :src="course.teacher.avatar|thumbAvatar"></u-image>
                        </view>
                        <view class="info">
                            <view class="name">{{ course.teacher.name }}</view>
                            <view class="title">{{ course.teacher.title || "小小教书匠" }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="tab-item tab-chapter" v-if="currentTab == 1">
                <view class="chapter-list" v-if="chapters.length > 0">
                    <course-chapter-list :items="chapters"></course-chapter-list>
                </view>
            </view>
            <view class="tab-item tab-review" v-if="currentTab == 2">
                <view class="rating-summary" v-if="course.rating > 0">
                    <view class="rating">
                        <view class="label">内容实用</view>
                        <view class="score">{{ course.ratings.rating1 }}</view>
                    </view>
                    <view class="rating">
                        <view class="label">简洁易懂</view>
                        <view class="score">{{ course.ratings.rating2 }}</view>
                    </view>
                    <view class="rating">
                        <view class="label">逻辑清晰</view>
                        <view class="score">{{ course.ratings.rating3 }}</view>
                    </view>
                </view>
                <view class="review-list" v-if="reviewList.items.length > 0">
                    <review-list :items="reviewList.items"></review-list>
                </view>
                <u-loadmore :status="reviewList.loadMore" v-if="reviewList.items.length > 0"></u-loadmore>
                <u-empty :show="reviewList.showEmpty" margin-top="50"></u-empty>
            </view>
            <view class="tab-item tab-consult" v-if="currentTab == 3">
                <view class="consult-list" v-if="consultList.items.length > 0">
                    <consult-list :items="consultList.items"></consult-list>
                </view>
                <u-loadmore :status="consultList.loadMore" v-if="consultList.items.length > 0"></u-loadmore>
                <u-empty :show="consultList.showEmpty" margin-top="50"></u-empty>
            </view>
            <view class="tab-item tab-package" v-if="currentTab == 4">
                <view class="package-list" v-if="packages.length > 0">
                    <course-package-list :items="packages"></course-package-list>
                </view>
            </view>
        </view>
        <view class="fixbar-padding"></view>
        <view class="fixbar">
            <view class="left">
                <u-icon name="account" size="36" :label="course.user_count|humanNumber"></u-icon>
                <u-icon :name="favoriteIcon.name" size="36" label="收藏" :color="favoriteIcon.color" @click="toggleFavorite"></u-icon>
                <u-icon name="chat" size="36" label="咨询" @click="popupConsultBox" v-if="showConsultIcon"></u-icon>
            </view>
            <view class="right">
                <u-button type="primary" size="medium" shape="circle" @click="gotoLogin" v-if="showLoginBtn">用户登录</u-button>
                <u-button type="error" size="medium" shape="circle" @click="buyCourse" v-if="showOrderBtn">立即购买</u-button>
            </view>
        </view>
        <u-popup v-model="showConsultBox" mode="bottom" :closeable="false">
            <view class="consult-box">
                <view class="header u-border-top u-border-bottom">
                    <text @click="closeConsultBox">取消</text>
                    <text>咨询</text>
                    <text @click="createConsult">发送</text>
                </view>
                <textarea class="textarea" v-model="myConsult" :auto-height="true" placeholder="请输入咨询内容"></textarea>
            </view>
        </u-popup>
    </view>
</template>

<script>
    import ReviewList from '@/components/review-list.vue'
    import ConsultList from '@/components/consult-list.vue'
    import CourseChapterList from '@/components/course-chapter-list.vue'
    import CoursePackageList from '@/components/course-package-list.vue'
    export default {
        components: {
            ReviewList,
            ConsultList,
            CourseChapterList,
            CoursePackageList,
        },
        data() {
            return {
                enableSticky: true,
                showConsultBox: false,
                tabs: [{
                    name: '介绍'
                }, {
                    name: '目录'
                }, {
                    name: '评价'
                }, {
                    name: '咨询'
                }],
                currentTab: 0,
                course: {
                    teacher: {},
                    attrs: {},
                    me: {},
                },
                chapters: [],
                packages: [],
                consultList: {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                    showEmpty: false,
                },
                reviewList: {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                    showEmpty: false,
                },
                myConsult: '',
            }
        },
        computed: {
            favoriteIcon: function() {
                let favorated = this.course.me.favorited == 1
                return {
                    name: favorated ? 'star-fill' : 'star',
                    color: favorated ? 'red' : '',
                }
            },
            showLoginBtn: function() {
                return this.course.me.logged == 0
            },
            showOrderBtn: function() {
                return this.course.me.allow_order == 1
            },
            showConsultIcon: function() {
                return this.course.market_price > 0
            }
        },
        onLoad(e) {
            this.loadCourse(e.id)
            this.loadChapters(e.id)
            this.loadReviews(e.id)
            this.loadConsults(e.id)
            this.loadPackages(e.id)
        },
        onShow() {
            this.enableSticky = true
        },
        onHide() {
            this.enableSticky = false
        },
        onReachBottom() {
            if (this.currentTab == 2) {
                if (this.reviewList.hasMore) {
                    this.loadReviews(this.course.id)
                }
            } else if (this.currentTab == 3) {
                if (this.consultList.hasMore) {
                    this.loadConsults(this.course.id)
                }
            }
        },
        methods: {
            getCurrentPageUrl() {
                return `/pages/course/info?id=${this.course.id}`
            },
            gotoLogin() {
                this.$utils.redirect('/pages/account/login')
            },
            gotoTeacher(id) {
                this.$utils.redirect('/pages/teacher/index', {
                    id: id
                })
            },
            initTab() {
                if (this.course.package_count > 0) {
                    this.tabs.push({
                        name: '套餐',
                        count: this.course.package_count
                    })
                }
            },
            changeTab(index) {
                if (this.currentTab != index) {
                    this.currentTab = index
                }
            },
            popupConsultBox() {
                this.$utils.checkLogin({
                    redirect: this.getCurrentPageUrl(),
                    success: () => {
                        this.showConsultBox = true
                    }
                })
            },
            closeConsultBox() {
                this.showConsultBox = false
            },
            buyCourse() {
                let redirect = `/pages/order/confirm?item_id=${this.course.id}&item_type=1`
                this.$utils.checkLogin({
                    redirect: redirect,
                    success: () => {
                        this.$utils.redirect(redirect)
                    }
                })
            },
            toggleFavorite() {
                this.$utils.checkLogin({
                    redirect: this.getCurrentPageUrl(),
                    success: () => {
                        this.$api.favoriteCourse(this.course.id).then(res => {
                            if (this.course.me.favorited == 1) {
                                this.course.me.favorited = 0
                            } else {
                                this.course.me.favorited = 1
                            }
                        }).catch(e => {
                            this.$u.toast('收藏课程失败')
                        })
                    }
                })
            },
            createConsult() {
                let params = {
                    course_id: this.course.id,
                    question: this.myConsult,
                }
                if (params.question.length < 5) {
                    return false
                }
                this.$api.createConsult(params).then(res => {
                    this.showConsultBox = false
                    this.myConsult = ''
                    this.$u.toast('提交咨询成功')
                }).catch(e => {
                    this.$u.toast(e.msg)
                })
            },
            loadCourse(id) {
                this.$api.getCourseInfo(id).then(res => {
                    this.course = res.course
                    this.initTab()
                }).catch(e => {
                    this.$u.toast('加载课程失败')
                })
            },
            loadChapters(id) {
                this.$api.getCourseChapters(id).then(res => {
                    this.chapters = res.chapters
                }).catch(e => {
                    this.$u.toast('加载目录失败')
                })
            },
            loadPackages(id) {
                this.$api.getCoursePackages(id).then(res => {
                    this.packages = res.packages
                }).catch(e => {
                    this.$u.toast('加载套餐失败')
                })
            },
            loadReviews(id) {
                let params = {}
                if (this.reviewList.page > 0) {
                    params.page = this.reviewList.page
                }
                this.$api.getCourseReviews(id, params).then(res => {
                    this.reviewList.items = this.reviewList.items.concat(res.pager.items)
                    this.reviewList.hasMore = res.pager.total_pages > this.reviewList.page
                    this.reviewList.loadMore = this.reviewList.hasMore ? 'loadmore' : 'nomore'
                    this.reviewList.showEmpty = this.reviewList.page == 1 && res.pager.total_pages == 0
                    this.reviewList.page++
                }).catch(e => {
                    this.$u.toast('加载评价失败')
                })
            },
            loadConsults(id) {
                let params = {}
                if (this.consultList.page > 0) {
                    params.page = this.consultList.page
                }
                this.$api.getCourseConsults(id, params).then(res => {
                    this.consultList.items = this.consultList.items.concat(res.pager.items)
                    this.consultList.hasMore = res.pager.total_pages > this.consultList.page
                    this.consultList.loadMore = this.consultList.hasMore ? 'loadmore' : 'nomore'
                    this.consultList.showEmpty = this.consultList.page == 1 && res.pager.total_pages == 0
                    this.consultList.page++
                }).catch(e => {
                    this.$u.toast('加载咨询失败')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 0;
    }

    .cover-box {
        margin-bottom: 30rpx;
    }

    .tab-title {
        margin-bottom: 15rpx;
    }

    .tab-content {
        padding-bottom: 100rpx;
    }

    .tab-item {
        padding: 15rpx;
    }

    .section {
        margin-bottom: 30rpx;
    }

    .section .head {
        margin-bottom: 15rpx;
    }

    .basic .title {
        color: $u-main-color;
        margin-bottom: 15rpx;
    }

    .basic .meta {
        color: $u-tips-color;
        margin-bottom: 15rpx;
    }

    .basic .meta text {
        margin-right: 15rpx;
    }

    .price {
        color: red;
    }

    .details {
        color: $u-content-color;
    }

    .rating-summary {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30rpx;
    }

    .rating-summary .rating {
        text-align: center;
    }

    .rating .label {
        margin-bottom: 10rpx;
    }

    .teacher {
        display: flex;
        padding: 15rpx 0;
    }

    .teacher .avatar {
        width: 90rpx;
        height: 90rpx;
        margin-right: 15rpx;
    }

    .teacher .info .name {
        color: $u-main-color;
        margin-bottom: 10rpx;
    }

    .teacher .info .title {
        color: $u-tips-color;
    }

    .consult-list,
    .review-list {
        margin-bottom: 50rpx;
    }

    .consult-box .header {
        display: flex;
        justify-content: space-between;
        padding: 15rpx 20rpx;
    }

    .consult-box .textarea {
        padding: 30rpx;
        width: 700rpx;
        min-height: 150rpx;
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

    .fixbar .left .u-icon,
    .fixbar .left u-icon {
        margin-right: 30rpx;
    }
</style>