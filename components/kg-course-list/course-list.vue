<template>
	<view class="course-list">
		<view class="list-item" v-for="course in showCourses" :key="course.id" @click="gotoCourse(course.id)">
			<view class="cover">
				<image :src="course.cover|thumbCover" mode="aspectFit"></image>
			</view>
			<view class="info">
				<view class="title">{{course.title}}</view>
				<view class="meta">
					<view v-if="course.market_price > course.vip_price">
						<text>{{course.market_price|formatPrice}}</text>
						<text v-if="course.vip_price > 0" class="price">会员{{course.market_price|formatPrice}}</text>
						<text v-else class="free">会员免费</text>
						<text>{{course.user_count}}人购买</text>
					</view>
					<view v-else-if="course.market_price > 0">
						<text class="price">{{course.market_price|formatPrice}}</text>
						<text class="user">{{course.user_count}}人购买</text>
					</view>
					<view v-else>
						<text class="free">免费</text>
						<text class="user">{{course.user_count}}人报名</text>
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
		width: 250rpx;
		height: 140rpx;
		margin-right: 10rpx;
	}

	.list-item .info {
		flex: 1;
	}

	.cover uni-image {
		width: 250rpx;
		height: 140rpx;
	}

	.info .title {
		margin: 5rpx 0 10rpx 0;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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
