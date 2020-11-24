<template>
	<view class="package-list">
		<view class="package" v-for="pkg in packages" :key="pkg.id">
			<view class="top">
				<view class="title">{{ pkg.title }}</view>
			</view>
			<view class="body">
				<view class="course" v-for="course in pkg.courses" :key="course.id" @click="gotoCourse(course.id)">
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
							<text>{{ course.market_price|formatPrice }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="left meta">
					市场价：<text class="price">{{ pkg.market_price|formatPrice }}</text>
					会员价：<text class="price">{{ pkg.vip_price|formatPrice }}</text>
				</view>
				<view class="right">
					<u-button type="primary" size="mini" @click="buyPackage(pkg.id)">购买套餐</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CoursePackageList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				packages: []
			}
		},
		created() {
			this.packages = this.items
		},
		methods: {
			buyPackage(id) {
				this.$utils.redirect('/pages/order/confirm', {
					item_id: id,
					item_type: 2,
				})
			},
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.package {
		margin-bottom: 30rpx;
	}

	.package .top {
		margin-bottom: 20rpx;
	}

	.package .body {
		margin-bottom: 15rpx;
	}

	.package .bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top .title {
		color: $u-main-color;
	}

	.package .course {
		display: flex;
		flex-direction: row;
		margin-bottom: 15rpx;
	}

	.course .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.course .info {
		flex: 1;
	}

	.info .title {
		width: 465rpx;
		color: $u-main-color;
		margin-bottom: 10rpx;
	}

	.info .meta {
		margin-bottom: 10rpx;
	}
	
	.price {
		color: red;
	}

	.meta {
		color: $u-tips-color;
	}

	.meta uni-text {
		margin-right: 15rpx;
	}
</style>
