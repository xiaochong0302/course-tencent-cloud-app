<template>
	<view class="item-list">
		<view class="item" v-for="course in courses" :key="course.id" @click="gotoCourse(course.id)">
			<view class="cover">
				<u-image :src="course.cover|thumbCover" width="240" height="134" border-radius="10"></u-image>
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
						<text v-if="course.vip_price > 0" class="price">会员{{ course.vip_price|formatPrice }}</text>
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
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				courses: []
			}
		},
		created() {
			this.courses = this.items
		},
		watch: {
			items: function() {
				this.courses = this.items
			}
		},
		methods: {
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			}
		}
	}
</script>

<style>
	.item {
		display: flex;
		margin-bottom: 15rpx;
	}

	.item .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.item .cover {
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
