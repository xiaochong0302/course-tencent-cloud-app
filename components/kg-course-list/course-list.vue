<template>
	<view class="course-list">
		<view class="list-item" v-for="course in showCourses" :key="course.id" @click="gotoCourse(course.id)">
			<view class="cover">
				<u-image width="240" height="134" border-radius="10" :src="course.cover|thumbCover"></u-image>
			</view>
			<view class="info">
				<view class="title u-line-1">{{ course.title }}</view>
				<view class="meta">
					<text>{{ course.level|courseLevel }}</text>
					<text>{{ course.lesson_count }}课时</text>
				</view>
				<view class="meta">
					<view v-if="course.market_price > course.vip_price">
						<text>{{ course.market_price|formatPrice }}</text>
						<text v-if="course.vip_price > 0" class="price">会员{{ course.market_price|formatPrice }}</text>
						<text v-else class="free">会员免费</text>
						<text>{{ course.user_count }}人购买</text>
					</view>
					<view v-else-if="course.market_price > 0">
						<text class="price">{{ course.market_price|formatPrice }}</text>
						<text class="user">{{ course.user_count }}人购买</text>
					</view>
					<view v-else>
						<text class="free">免费</text>
						<text class="user">{{ course.user_count }}人报名</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CourseList',
		data() {
			return {
				showCourses: []
			}
		},
		props: {
			courses: {
				type: Array
			}
		},
		created() {
			this.showCourses = this.courses
		},
		watch: {
			courses: function() {
				this.showCourses = this.courses
			}
		},
		methods: {
			gotoCourse(id) {
				this.$utils.redirect(`/pages/course/info?id=${id}`)
			}
		}
	}
</script>

<style>
	.course-list {
		margin: 15rpx 0;
	}

	.list-item {
		margin-bottom: 15rpx;
		display: flex;
		flex-flow: row;
	}

	.list-item .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.list-item .info {
		flex: 1;
	}

	.cover {
		width: 240rpx;
		height: 134rpx;
	}

	.info .title {
		margin-bottom: 10rpx;
		width: 465rpx;
	}

	.meta {
		margin-bottom: 10rpx;
	}

	.meta uni-text {
		margin-right: 10rpx;
	}

	.meta .free {
		color: green;
	}

	.meta .price {
		color: red;
	}
</style>
