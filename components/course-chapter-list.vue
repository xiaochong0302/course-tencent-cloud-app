<template>
	<view>
		<u-collapse>
			<u-collapse-item :title="chapter.title" v-for="(chapter,index) in chapters" :key="index">
				<view class="lesson u-line-1" v-for="lesson in chapter.children" :key="lesson.id" @click="gotoChapter(lesson)">
					<view class="left">
						<view class="model">
							<u-tag type="info" size="mini" text="点播" v-if="lesson.model == 1"></u-tag>
							<u-tag type="info" size="mini" text="直播" v-else-if="lesson.model == 2"></u-tag>
							<u-tag type="info" size="mini" text="图文" v-else-if="lesson.model == 3"></u-tag>
						</view>
						<view class="info">
							<view class="title u-line-1">{{ lesson.title }}</view>
							<view class="meta" v-if="lesson.model == 2">
								<text>{{ lesson.attrs.start_time|timeFormat('mm月dd日 hh:MM') }} - {{ lesson.attrs.end_time|timeFormat('hh:MM') }}</text>
								<text>{{ getLiveStatus(lesson) }}</text>
							</view>
						</view>
					</view>
					<view class="right">
						<u-icon name="lock" v-if="lesson.me.owned == 0"></u-icon>
					</view>
				</view>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	export default {
		name: 'CourseChapterList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				chapters: []
			}
		},
		created() {
			this.chapters = this.items
		},
		methods: {
			getLiveStatus(chapter) {
				let nowTime = this.$utils.getNowTime()
				if (chapter.attrs.stream.status == 'active') {
					return '直播中'
				} else if (chapter.attrs.start_time > nowTime) {
					return '倒计时'
				} else if (chapter.attrs.end_time < nowTime) {
					return '已结束'
				} else {
					return ''
				}
			},
			gotoChapter(chapter) {
				if (chapter.me.owned == 0) {
					return false
				}
				let mapping = {
					'1': 'vod',
					'2': 'live',
					'3': 'read',
				}
				let target = mapping[chapter.model] ? mapping[chapter.model] : 'vod'
				this.$utils.redirect(`/pages/chapter/${target}?id=${chapter.id}`)
			}
		}
	}
</script>

<style>
	.lesson {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.left {
		display: flex;
	}

	.model {
		width: 80rpx;
	}

	.info .title {
		margin-bottom: 15rpx;
		width: 540rpx;
	}

	.meta uni-text {
		margin-right: 15rpx;
	}

	.right .u-icon {
		margin-right: 20rpx;
	}
</style>
