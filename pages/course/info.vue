<template>
	<view>
		<view class="cover-box">
			<u-image :src="course.cover" width="100%" height="416"></u-image>
		</view>
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-item tab-summary" v-if="currentTab == 0">
				<view class="section">
					<u-section title="基本信息" :right="false"></u-section>
					<view class="basic">
						<view class="title">{{ course.title }}</view>
						<view class="meta" v-if="course.model == 1">课程时长：{{ course.attrs.duration|formatDuration }}</view>
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
					<u-section title="授课教师" :right="false"></u-section>
					<u-cell-group>
						<u-cell-item v-for="teacher in course.teachers" :key="teacher.id" :title="teacher.name" :label="teacher.title"
						 :index="teacher.id" :arrow="true" :title-style="{'padding-left':'15rpx'}" @click="gotoTeacher">
							<u-icon slot="icon" :name="teacher.avatar|thumbAvatar" size="60"></u-icon>
						</u-cell-item>
					</u-cell-group>
				</view>
				<view class="section" v-if="course.market_price == 0">
					<u-section title="赞赏支持" :right="false"></u-section>
					<view class="reward-list">
						<u-button v-for="option in rewardOptions" :key="option.id" type="primary" size="mini" @click="rewardCourse(course.id,option.id)">{{ option.title }}</u-button>
					</view>
				</view>
				<view class="sticky" v-if="course.me.owned == 0 && course.market_price > 0">
					<u-button type="primary" @click="buyCourse(course.id)">立即购买</u-button>
				</view>
			</view>
			<view class="tab-item tab-chapter" v-if="currentTab == 1">
				<u-collapse>
					<u-collapse-item :title="chapter.title" v-for="(chapter,index) in chapters" :key="index">
						<view class="lesson u-line-1" v-for="lesson in chapter.children" :key="lesson.id" @click="gotoChapter(lesson.id,lesson.model)">{{ lesson.title }}</view>
					</u-collapse-item>
				</u-collapse>
			</view>
			<view class="tab-item tab-review" v-if="currentTab == 2">
				<view class="rating-summary">
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
				<view class="review-list">
					<view class="review" v-for="review in reviews" :key="review.id">
						<view class="avatar">
							<u-image :src="review.owner.avatar|thumbAvatar" width="60rpx" height="60rpx" shape="circle" mode="aspectFit"></u-image>
						</view>
						<view class="info">
							<view class="top">
								<view class="name">{{ review.owner.name }}</view>
								<view class="rating">
									<u-rate size="28" :current="review.rating" :disabled="true"></u-rate>
								</view>
							</view>
							<view class="content">{{ review.content }}</view>
							<view class="bottom">
								<view class="time">{{ $u.timeFrom(review.create_time,'yyyy-mm-dd') }}</view>
								<view class="like">
									<u-icon name="thumb-up" :label="review.like_count"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="review-more" v-if="course.review_count > 12">
					<u-button size="medium" @click="gotoReviewList(course.id)">更多评价</u-button>
				</view>
			</view>
			<view class="tab-item tab-consult" v-if="currentTab == 3"></view>
			<view class="tab-item tab-package" v-if="currentTab == 4">
				<view class="package" v-for="pkg in packages" :key="pkg.id">
					<view class="top">
						<view class="title">{{ pkg.title }}</view>
					</view>
					<view class="body">
						<view class="course" v-for="course in pkg.courses" :key="course.id" @click="gotoCourse(course.id)">
							<view class="cover">
								<u-image width="240" height="134" border-radius="10" :src="course.cover|thumbCover"></u-image>
							</view>
							<view class="info">
								<view class="title u-line-1">{{ course.title }}</view>
								<view class="meta">
									<text>{{ course.level|courseLevel }}</text>
									<text>{{ course.lesson_count }}课时</text>
								</view>
								<view class="meta">{{ course.market_price|formatPrice }}</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="left meta">
							<text>市场价：{{ pkg.market_price|formatPrice }}</text>
							<text>会员价：{{ pkg.vip_price|formatPrice }}</text>
						</view>
						<view class="right">
							<u-button type="primary" size="mini" @click="buyPackage(pkg.id)">购买套餐</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
					name: '介绍'
				}, {
					name: '目录'
				}, {
					name: '评价'
				},{
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
			}
		},
		onLoad(e) {
			this.loadCourse(e.id)
			this.loadChapters(e.id)
			this.loadReviews(e.id)
			this.loadConsults(e.id)
			this.loadPackages(e.id)
			this.loadRewardOptions()
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
			rewardCourse(courseId, rewardId) {
				let id = `${courseId}-${rewardId}`
				this.$utils.redirect(`/pages/order/confirm?item_id=${id}&item_type=3`)
			},
			buyCourse(id) {
				this.$utils.redirect(`/pages/order/confirm?item_id=${id}&item_type=1`)
			},
			buyPackage(id) {
				this.$utils.redirect(`/pages/order/confirm?item_id=${id}&item_type=2`)
			},
			gotoCourse(id) {
				this.$utils.redirect(`/pages/course/info?id=${id}`)
			},
			gotoTeacher(id) {
				this.$utils.redirect(`/pages/teacher/index?id=${id}`)
			},
			gotoChapter(id, model) {
				let mapping = {
					'1': 'vod',
					'2': 'live',
					'3': 'read',
				}
				let target = mapping[model] ? mapping[model] : 'vod'
				this.$utils.redirect(`/pages/chapter/${target}?id=${id}`)
			},
			gotoReviewList(id) {
				this.$utils.redirect(`/pages/course/reviews?id=${id}`)
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
			loadRewardOptions() {
				this.$api.getRewardOptions().then(res => {
					this.rewardOptions = res.options
				}).catch(e => {
					this.$u.toast('加载赞赏失败')
				})
			}
		}
	}
</script>

<style>
	.cover-box {
		width: 100%;
		height: 416rpx;
		margin-bottom: 15rpx;
	}

	.u-section {
		margin-bottom: 30rpx;
	}

	.tab-title {
		margin-bottom: 15rpx;
	}

	.tab-content {
		padding: 15rpx;
	}

	.tab-summary {
		margin-bottom: 100rpx;
	}

	.section {
		margin-bottom: 30rpx;
	}

	.sticky {
		padding: 15rpx;
		position: fixed;
		display: flex;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.sticky .u-btn {
		flex: 1;
	}

	.basic .title {
		font-weight: 600;
		margin-bottom: 15rpx;
	}

	.basic .meta {
		margin-bottom: 15rpx;
	}

	.basic .meta text {
		margin-right: 15rpx;
	}

	.reward-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 20rpx;
	}

	.reward-list .u-btn {
		min-width: 200rpx;
		margin-bottom: 15rpx;
	}

	.lesson {
		padding: 15rpx;
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

	.review-list {
		margin-bottom: 20rpx;
	}

	.review-more {
		display: flex;
		justify-content: center;
		margin-bottom: 15rpx;
	}

	.review {
		display: flex;
		margin-bottom: 30rpx;
	}

	.review .avatar {
		width: 60rpx;
		height: 60rpx;
	}

	.review .info {
		flex: 1;
	}

	.review .avatar {
		margin-right: 15rpx;
	}

	.review .top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.review .bottom {
		display: flex;
		justify-content: space-between;
	}

	.review .content {
		margin-bottom: 15rpx;
	}

	.package {
		margin-bottom: 30rpx;
	}

	.package .top {
		margin-bottom: 20rpx;
	}

	.package .body {
		margin-bottom: 15rpx;
	}

	.package .top .title {
		font-weight: 600;
	}

	.package .course {
		display: flex;
		flex-direction: row;
		margin-bottom: 15rpx;
	}

	.package .course .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.package .course .info {
		flex: 1;
	}

	.package .info .title {
		margin-bottom: 10rpx;
		width: 465rpx;
	}

	.package .info .meta {
		margin-bottom: 10rpx;
	}

	.meta text {
		margin-right: 15rpx;
	}

	.package .bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
