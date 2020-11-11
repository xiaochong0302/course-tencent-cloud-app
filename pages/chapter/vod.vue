<template>
	<view>
		<view class="player" id="player"></view>
		<view class="u-p-15">
			<u-section :title="chapter.course.title" sub-title="详情" @click="gotoCourse"></u-section>
		</view>
		<view class="u-p-15">
			<u-collapse>
				<u-collapse-item v-for="(chapter,index) in chapters" :key="index" :title="chapter.title" :open="chapter.open">
					<view :class="lessonClass(lesson.id)" v-for="lesson in chapter.children" :key="lesson.id" @click="gotoChapter(lesson.id,lesson.model)">{{ lesson.title }}</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import {
		TcPlayer
	} from '@/common/tcplayer.js'
	export default {
		data() {
			return {
				player: null,
				chapter: {
					course: {}
				},
				chapters: [],
				learning: {
					interval: null,
					interval_time: 15000,
					request_id: this.$u.guid(16),
					plan_id: 0,
					position: 0,
				}
			}
		},
		computed: {
			lessonClass: function() {
				return function(id) {
					return id == this.chapter.id ? 'lesson active u-line-1' : 'lesson u-line-1'
				}
			}
		},
		onLoad(e) {
			this.loadChapter(e.id)
		},
		methods: {
			initPlayer(playUrls) {
				let options = {}
				let sys = uni.getSystemInfoSync()
				options.width = sys.windowWidth
				options.height = Math.ceil(sys.windowWidth * 9 / 16)
				if (playUrls.od) {
					options.m3u8 = playUrls.od.url
				}
				if (playUrls.hd) {
					options.m3u8_hd = playUrls.hd.url
				}
				if (playUrls.sd) {
					options.m3u8_sd = playUrls.sd.url
				}
				options.autoplay = false
				options.listener = (msg) => {
					if (msg.type == 'play') {
						this.onPlay()
					} else if (msg.type == 'pause') {
						this.onPause()
					} else if (msg.type == 'ended') {
						this.onEnded()
					}
				}
				this.player = new TcPlayer('player', options)
				/**
				 * 过于接近结束不设置播放位置
				 */
				if (this.player.duration() - this.learning.position > 10) {
					this.player.currentTime(this.learning.position)
				}
			},
			onPlay() {
				this.clearLearningInterval()
				this.setLearningInterval()
			},
			onPause() {
				this.clearLearningInterval()
			},
			onEnded() {
				this.clearLearningInterval()
				this.learningChapter()
			},
			setLearningInterval() {
				this.learning.interval = setInterval(this.learningChapter, this.learning.interval_time)
			},
			clearLearningInterval() {
				clearInterval(this.learning.interval)
				this.learning.interval = null
			},
			learningChapter() {
				this.learning.position = this.player.currentTime()
				this.$api.learningChapter(this.chapter.id, {
					plan_id: this.learning.plan_id,
					request_id: this.learning.request_id,
					interval_time: this.learning.interval_time,
					position: this.learning.position,
				}).catch(e => {
					console.log(e.msg)
				})
			},
			gotoCourse() {
				this.$utils.redirect(`/pages/course/info?id=${this.chapter.course.id}`)
			},
			gotoChapter(id) {
				this.$utils.redirect(`/pages/chapter/vod?id=${id}`)
			},
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.learning.plan_id = res.chapter.me.plan_id
					this.learning.position = res.chapter.me.position
					this.initPlayer(res.chapter.play_urls)
					this.loadChapters(res.chapter.course.id)
				}).catch(e => {
					this.$u.toast('加载课时失败')
				})
			},
			loadChapters(id) {
				this.$api.getCourseChapters(id).then(res => {
					this.chapters = this.handleChapters(res.chapters)
				}).catch(e => {
					this.$u.toast('加载目录失败')
				})
			},
			handleChapters(chapters) {
				return chapters.map(chapter => {
					chapter.open = false
					chapter.children.forEach(item => {
						if (item.id == this.chapter.id) {
							chapter.open = true
							return
						}
					})
					return chapter
				})
			}
		}
	}
</script>

<style>
	.player {
		width: 750rpx;
		height: 422rpx;
		margin-bottom: 30rpx;
	}

	.section {
		padding: 15rpx;
		margin-bottom: 15rpx;
	}

	.lesson {
		padding: 15rpx;
	}

	.active {
		color: #007AFF;
	}
</style>
