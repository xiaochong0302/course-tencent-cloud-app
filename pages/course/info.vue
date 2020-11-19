<template>
	<view v-if="course.id > 0">
		<view class="cover-box">
			<u-image :src="course.cover|thumbCover" width="100%" height="416"></u-image>
		</view>
		<u-sticky :enable="enableSticky">
			<view class="tab-title">
				<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
			</view>
		</u-sticky>
		<view class="tab-content">
			<view class="tab-item tab-summary" v-if="currentTab == 0">
				<view class="section">
					<u-section title="基本信息" :right="false"></u-section>
					<view class="basic">
						<view class="title">{{ course.title }}</view>
						<view class="meta">
							<text>学习期限：{{ course.study_expiry }}个月</text>
							<text>退款期限：{{ course.refund_expiry }}个月</text>
						</view>
						<view class="meta">
							<text>市场价格：{{ course.market_price|formatPrice }}</text>
							<text>会员价格：{{ course.vip_price|formatPrice }}</text>
						</view>
						<view class="meta">
							<text>难度级别：{{ course.level|courseLevel }}</text>
							<text>学习人次：{{ course.user_count }}</text>
						</view>
					</view>
				</view>
				<view class="section" v-if="course.details">
					<u-section title="课程介绍" :right="false"></u-section>
					<view class="details">{{ course.details }}</view>
				</view>
				<view class="section" v-if="course.teachers.length > 0">
					<course-teacher :items="course.teachers"></course-teacher>
				</view>
				<view class="section">
					<view class="social">
						<u-icon name="share" size="36" label="分享"></u-icon>
						<u-icon name="chat" size="36" label="咨询"></u-icon>
						<u-icon :name="starIcon.name" :color="starIcon.color" size="36" label="收藏" @click="favoriteCourse(course.id)"></u-icon>
					</view>
				</view>
			</view>
			<view class="tab-item tab-chapter" v-if="currentTab == 1">
				<view class="chapter-list" v-if="chapters.length > 0">
					<course-chapter :items="chapters"></course-chapter>
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
				<view class="review-list" v-if="reviews.length > 0">
					<review-list :items="reviews"></review-list>
				</view>
				<view class="review-more" v-if="course.review_count > 12">
					<text @click="gotoReviewList(course.id)">更多评价</text>
				</view>
				<u-empty margin-top="100" :show="reviews.length == 0"></u-empty>
			</view>
			<view class="tab-item tab-consult" v-if="currentTab == 3">
				<view class="consult-list" v-if="consults.length > 0">
					<consult-list :items="consults"></consult-list>
				</view>
				<view class="consult-more" v-if="course.consult_count > 12">
					<text @click="gotoConsultList(course.id)">更多咨询</text>
				</view>
				<u-empty margin-top="100" :show="consults.length == 0"></u-empty>
			</view>
			<view class="tab-item tab-package" v-if="currentTab == 4">
				<view class="package-list" v-if="packages.length > 0">
					<course-package :items="packages"></course-package>
				</view>
			</view>
		</view>
		<view class="sticky-box">
			<u-button type="primary" @click="buyCourse(course.id)" v-if="showOrderBtn">立即购买</u-button>
			<u-button type="primary" @click="rewardCourse(course.id)" v-if="showRewardBtn">赞赏支持</u-button>
		</view>
	</view>
</template>

<script>
	import ReviewList from '@/components/review-list.vue'
	import ConsultList from '@/components/consult-list.vue'
	import CourseChapter from '@/components/course-chapter.vue'
	import CourseTeacher from '@/components/course-teacher.vue'
	import CoursePackage from '@/components/course-package.vue'
	export default {
		components: {
			ReviewList,
			ConsultList,
			CourseChapter,
			CourseTeacher,
			CoursePackage,
		},
		data() {
			return {
				enableSticky: true,
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
					teachers: [],
					me: {},
				},
				chapters: [],
				reviews: [],
				consults: [],
				packages: [],
			}
		},
		computed: {
			starIcon: function() {
				let favorated = this.course.me.favorited == 1
				return {
					name: favorated ? 'star-fill' : 'star',
					color: favorated ? 'red' : '',
				}
			},
			showOrderBtn: function() {
				return this.course.me.owned == 0 && this.course.market_price > 0
			},
			showRewardBtn: function() {
				return this.course.me.owned == 1 || this.course.market_price == 0
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
		methods: {
			initTab() {
				this.tabs[2].count = this.course.review_count
				this.tabs[3].count = this.course.consult_count
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
			favoriteCourse(id) {
				this.$api.favoriteCourse(id).then(res => {
					if (this.course.me.favorited == 1) {
						this.course.me.favorited = 0
					} else {
						this.course.me.favorited = 1
					}
				}).catch(e => {
					this.$u.toast('收藏课程失败')
				})
			},
			buyCourse(id) {
				this.$utils.redirect(`/pages/order/confirm?item_id=${id}&item_type=1`)
			},
			rewardCourse(id) {
				this.$utils.redirect(`/pages/course/reward?id=${id}`)
			},
			gotoReviewList(id) {
				this.$utils.redirect(`/pages/course/reviews?id=${id}`)
			},
			gotoConsultList(id) {
				this.$utils.redirect(`/pages/course/consults?id=${id}`)
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
			loadReviews(id) {
				this.$api.getCourseReviews(id).then(res => {
					this.reviews = res.pager.items
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			},
			loadConsults(id) {
				this.$api.getCourseConsults(id).then(res => {
					this.consults = res.pager.items
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			},
			loadPackages(id) {
				this.$api.getCoursePackages(id).then(res => {
					this.packages = res.packages
				}).catch(e => {
					this.$u.toast('加载套餐失败')
				})
			}
		}
	}
</script>

<style>
	.sticky-box {
		background-color: #FFFFFF;
		padding: 15rpx;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.cover-box {
		width: 750rpx;
		height: 416rpx;
		margin-bottom: 30rpx;
	}

	.u-section {
		margin-bottom: 30rpx;
	}

	.tab-title {
		margin-bottom: 15rpx;
	}

	.tab-content {
		padding: 15rpx;
		margin-bottom: 120rpx;
	}

	.section {
		margin-bottom: 30rpx;
	}

	.social {
		display: flex;
		justify-content: center;
		margin-bottom: 15rpx;
	}

	.social .u-icon {
		margin-right: 30rpx;
	}

	.basic .title {
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.basic .meta {
		margin-bottom: 15rpx;
	}

	.basic .meta uni-text {
		margin-right: 15rpx;
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

	.review-list,
	.consult-list {
		margin-bottom: 20rpx;
	}

	.review-more,
	.consult-more {
		display: flex;
		justify-content: center;
		margin-bottom: 15rpx;
	}
</style>
