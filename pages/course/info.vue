<template>
	<view v-if="course.id > 0">
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
					<u-section title="基本信息" :right="false"></u-section>
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
					<u-section title="课程介绍" :right="false"></u-section>
					<view class="details">{{ course.details }}</view>
				</view>
				<view class="section" v-if="course.teachers.length > 0">
					<course-teacher-list :items="course.teachers"></course-teacher-list>
				</view>
				<view class="section">
					<view class="social">
						<u-icon :name="starIcon.name" :color="starIcon.color" size="36" label="收藏" @click="favoriteCourse(course.id)"></u-icon>
						<u-icon name="chat" size="36" label="咨询" @click="addConsult(course.id)"></u-icon>
						<u-icon name="rmb-circle" size="36" label="赞赏" @click="popupRewardBox"></u-icon>
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
				<view class="review-list" v-if="reviews.length > 0">
					<review-list :items="reviews"></review-list>
				</view>
				<view class="load-more" @click="gotoReviewList(course.id)" v-if="course.review_count > 12">
					<u-divider half-width="50">加载更多</u-divider>
				</view>
				<u-empty margin-top="100" :show="reviews.length == 0"></u-empty>
			</view>
			<view class="tab-item tab-consult" v-if="currentTab == 3">
				<view class="consult-list" v-if="consults.length > 0">
					<consult-list :items="consults"></consult-list>
				</view>
				<view class="load-more" @click="gotoConsultList(course.id)" v-if="course.consult_count > 12">
					<u-divider half-width="50">加载更多</u-divider>
				</view>
				<u-empty margin-top="100" :show="consults.length == 0"></u-empty>
			</view>
			<view class="tab-item tab-package" v-if="currentTab == 4">
				<view class="package-list" v-if="packages.length > 0">
					<course-package-list :items="packages"></course-package-list>
				</view>
			</view>
		</view>
		<view class="sticky-bottom">
			<u-button type="primary" @click="buyCourse(course.id)" v-if="showOrderBtn">立即购买</u-button>
		</view>
		<u-popup v-model="showRewardBox" mode="bottom" :closeable="true">
			<view class="reward-option-list">
				<view class="reward-option" v-for="option in rewardOptions" :key="option.id">
					<u-button type="primary" size="medium" @click="rewardCourse(option.id)">{{ option.title }}</u-button>
				</view>
			</view>
		</u-popup>
	</view>
	</view>
</template>

<script>
	import ReviewList from '@/components/review-list.vue'
	import ConsultList from '@/components/consult-list.vue'
	import CourseChapterList from '@/components/course-chapter-list.vue'
	import CourseTeacherList from '@/components/course-teacher-list.vue'
	import CoursePackageList from '@/components/course-package-list.vue'
	export default {
		components: {
			ReviewList,
			ConsultList,
			CourseChapterList,
			CourseTeacherList,
			CoursePackageList,
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
				rewardOptions: [],
				showRewardBox: false,
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
			this.loadRewardOptions(e.id)
		},
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
		},
		methods: {
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
			popupRewardBox() {
				this.showRewardBox = true
			},
			favoriteCourse(id) {
				let redirect = `/pages/course/info?id=${id}`
				this.$utils.checkLogin({
					redirect: redirect,
					success: () => {
						this.$api.favoriteCourse(id).then(res => {
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
			addConsult(id) {
				let redirect = `/pages/consult/add?course_id=${id}`
				this.$utils.checkLogin({
					redirect: redirect,
					success: () => {
						this.$utils.redirect(redirect)
					}
				})
			},
			buyCourse(id) {
				let redirect = `/pages/order/confirm?item_id=${id}&item_type=1`
				this.$utils.checkLogin({
					redirect: redirect,
					success: () => {
						this.$utils.redirect(redirect)
					}
				})
			},
			rewardCourse(optId) {
				let itemId = `${this.course.id}-${optId}`
				let redirect = `/pages/order/confirm?item_id=${itemId}&item_type=3`
				this.$utils.checkLogin({
					redirect: redirect,
					success: () => {
						this.showRewardBox = false
						this.$utils.redirect(redirect)
					}
				})
			},
			gotoReviewList(id) {
				this.$utils.redirect('/pages/course/reviews', {
					id: id
				})
			},
			gotoConsultList(id) {
				this.$utils.redirect('/pages/course/consults', {
					id: id
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
			},
			loadRewardOptions(id) {
				this.$api.getRewardOptions().then(res => {
					this.rewardOptions = res.options
				}).catch(e => {
					this.$u.toast('加载赞赏失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sticky-bottom {
		z-index: 999;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: white;
		padding: 15rpx;
	}

	.cover-box {
		margin-bottom: 30rpx;
	}

	.u-section {
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

	.social {
		display: flex;
		justify-content: center;
		margin-bottom: 15rpx;
	}

	.social .u-icon {
		margin-right: 30rpx;
	}

	.reward-option-list {
		display: flex;
		flex-wrap: wrap;
		padding-top: 100rpx;
	}

	.reward-option {
		margin-left: 50rpx;
		margin-bottom: 50rpx;
	}

	.reward-option .u-btn {
		padding-left: 30rpx;
		padding-right: 30rpx;
		min-width: 180rpx;
	}

	.basic .title {
		color: $u-main-color;
		margin-bottom: 15rpx;
	}

	.basic .meta {
		color: $u-tips-color;
		margin-bottom: 15rpx;
	}

	.basic .meta uni-text {
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

	.load-more {
		display: flex;
		justify-content: center;
		color: $u-tips-color;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}
</style>
