<template>
	<view class="item-list">
		<view class="item" v-for="(item,index) in items" :key="item.key" @click="gotoCourse(item.course.id)">
			<view class="cover">
				<u-image :src="item.course.cover|thumbCover" width="240" height="134" border-radius="10"></u-image>
			</view>
			<view class="info">
				<view class="title u-line-1">{{ item.course.title }}</view>
				<view class="meta">
					<text class="duration">课时：{{ item.course.lesson_count }}</text>
					<text class="progress">评分：{{ item.course.rating }}</text>
				</view>
				<view class="meta">
					<text class="progress">进度：{{ item.progress }}%</text>
					<text class="duration">用时：{{ item.duration|formatDuration }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UserCourseList',
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
			this.courses = this.handleCourses(this.items)
		},
		watch: {
			items: function() {
				this.courses = this.handleCourses(this.items)
			}
		},
		methods: {
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			},
			handleCourses(items) {
				return items.map(item => {
					item.key = item.course.id + '-' + item.plan_id
					return item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 10rpx 0;
	}

	.item .cover {
		width: 240rpx;
		height: 134rpx;
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.info .title {
		width: 465rpx;
		color: $u-main-color;
		margin-bottom: 10rpx;
	}

	.info .meta {
		color: $u-tips-color;
		margin-bottom: 10rpx;
	}

	.meta uni-text {
		margin-right: 15rpx;
	}
</style>
