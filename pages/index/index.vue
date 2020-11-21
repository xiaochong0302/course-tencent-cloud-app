<template>
	<view class="container">
		<view class="module module-search">
			<u-search v-model="query" :show-action="false" maxlength="30" placeholder="请输入搜索内容" @search="search"></u-search>
		</view>
		<view class="module module-slide">
			<view class="slide-list" v-if="slides.length > 0">
				<u-swiper :list="slides" @click="clickSlide"></u-swiper>
			</view>
		</view>
		<view class="module module-course">
			<view class="tab-title">
				<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
			</view>
			<view class="tab-content">
				<view class="tab-new-course" v-if="currentTab == 0">
					<view class="course-list" v-if="newCourses.length > 0">
						<course-list :items="newCourses"></course-list>
					</view>
				</view>
				<view class="tab-free-course" v-if="currentTab == 1">
					<view class="course-list" v-if="freeCourses.length > 0">
						<course-list :items="freeCourses"></course-list>
					</view>
				</view>
				<view class="tab-vip-course" v-if="currentTab == 2">
					<view class="course-list" v-if="vipCourses.length > 0">
						<course-list :items="vipCourses"></course-list>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CourseList from '@/components/course-list.vue'
	export default {
		components: {
			CourseList
		},
		data() {
			return {
				query: '',
				slides: [],
				newCourses: [],
				freeCourses: [],
				vipCourses: [],
				currentTab: 0,
				tabs: [{
					name: '新上课程'
				}, {
					'name': '免费课程'
				}, {
					name: '会员课程'
				}]
			}
		},
		onLoad() {
			this.loadSlides()
			this.loadNewCourses()
			this.loadFreeCourses()
			this.loadVipCourses()
		},
		methods: {
			search() {
				if (this.query.length > 1) {
					this.$utils.redirect('/pages/search/index', {
						query: this.query
					})
				}
			},
			clickSlide(index) {
				this.$utils.redirect(this.slides[index].url)
			},
			changeTab(index) {
				if (this.currentTab !== index) {
					this.currentTab = index
				}
			},
			loadSlides() {
				this.$api.getIndexSlides().then(res => {
					this.slides = this.handleSlides(res.slides)
				}).catch(e => {
					this.$u.toast('加载轮播失败')
				})
			},
			loadNewCourses() {
				this.$api.getIndexNewCourses().then(res => {
					this.newCourses = res.courses
				}).catch(e => {
					this.$u.toast('加载新上课程失败')
				})
			},
			loadFreeCourses() {
				this.$api.getIndexFreeCourses().then(res => {
					this.freeCourses = res.courses
				}).catch(e => {
					this.$u.toast('加载免费课程失败')
				})
			},
			loadVipCourses() {
				this.$api.getIndexVipCourses().then(res => {
					this.vipCourses = res.courses
				}).catch(e => {
					this.$u.toast('加载会员课程失败')
				})
			},
			handleSlides(slides) {
				return slides.map(slide => {
					slide.image = this.$utils.thumbSlide(slide.cover)
					if (slide.target == 1) {
						slide.url = `/pages/course/info?id=${slide.content}`
					} else if (slide.target == 2) {
						slide.url = `/pages/page/info?id=${slide.content}`
					} else if (slide.target == 3) {
						slide.url = slide.content
					}
					return slide
				})
			}
		}
	}
</script>

<style>
	.module {
		margin-bottom: 30rpx;
	}

	.module-search {
		margin-bottom: 15rpx;
	}

	.module-slide {
		margin-bottom: 15rpx;
	}

	.tab-title {
		margin-bottom: 20rpx;
	}
</style>
