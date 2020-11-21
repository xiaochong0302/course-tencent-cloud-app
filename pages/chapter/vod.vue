<template>
	<view v-if="chapter.id > 0">
		<u-popup v-model="showConsultForm" mode="bottom" @open="onConsultFormOpened">
			<u-form class="consult-form" :model="consultForm" ref="consultForm" :error-type="['message']">
				<u-form-item label="咨询内容" label-position="top" prop="question">
					<u-input v-model="consultForm.question" type="textarea" maxlength="255" placeholder="请尽量详细描述问题，以便获得更专业的回复"></u-input>
				</u-form-item>
				<u-form-item label="私密">
					<u-radio-group v-model="private.name" @change="changePrivate">
						<u-radio v-for="(item,index) in private.options" :key="index" :name="item.name">{{ item.name }}</u-radio>
					</u-radio-group>
				</u-form-item>
				<view class="form-item">
					<u-button type="primary" @click="submitConsult">提交</u-button>
				</view>
			</u-form>
		</u-popup>
		<u-sticky :enable="enableSticky">
			<view class="sticky">
				<view class="player" id="player"></view>
				<view class="action u-p-15">
					<u-icon :name="likeIcon.name" size="36" :color="likeIcon.color" :label="chapter.like_count" @click="likeChapter(chapter.id)"></u-icon>
					<u-icon name="account" size="36" :label="chapter.user_count"></u-icon>
					<u-icon name="chat" size="36" :label="chapter.consult_count" @click="popupConsultForm"></u-icon>
				</view>
				<view class="u-p-15">
					<u-section :title="chapter.course.title" sub-title="详情" @click="gotoCourse(chapter.course.id)"></u-section>
				</view>
			</view>
		</u-sticky>
		<view class="u-p-15">
			<consult-list :items="consults"></consult-list>
		</view>
		<u-back-top :scrollTop="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import {
		TcPlayer
	} from '@/common/tcplayer.js'
	import ConsultList from '@/components/consult-list.vue'
	export default {
		components: {
			ConsultList
		},
		data() {
			return {
				enableSticky: true,
				player: null,
				chapter: {
					course: {},
					me: {},
				},
				learning: {
					interval: null,
					interval_time: 15000,
					request_id: this.$u.guid(16),
					plan_id: 0,
					position: 0,
				},
				consults: [],
				page: 1,
				hasMore: false,
				scrollTop: 0,
				showConsultForm: false,
				private: {
					name: '否',
					value: 0,
					options: [{
						name: '是'
					}, {
						name: '否'
					}]
				},
				consultForm: {
					question: '',
				},
				consultRules: {
					question: [{
						required: true,
						message: '请填写咨询内容'
					}, {
						min: 10,
						max: 255,
						message: '咨询内容10-255个字符'
					}]
				}
			}
		},
		computed: {
			likeIcon: function() {
				let liked = this.chapter.me.liked == 1
				return {
					name: liked ? 'thumb-up-fill' : 'thumb-up',
					color: liked ? 'red' : '',
				}
			}
		},
		onLoad(e) {
			this.chapter.id = e.id
			this.loadChapter(e.id)
			this.loadConsults(e.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadConsults(this.chapter.id)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onShow() {
			this.enableSticky = true
		},
		onHide() {
			this.enableSticky = false
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
				this.clearLearningInterval()
				this.learning.interval = setInterval(this.learningChapter, this.learning.interval_time)
			},
			clearLearningInterval() {
				if (this.learning.interval != null) {
					clearInterval(this.learning.interval)
					this.learning.interval = null
				}
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
			likeChapter(id) {
				this.$api.likeChapter(id).then(res => {
					if (this.chapter.me.liked == 1) {
						this.chapter.me.liked = 0
						this.chapter.like_count--
					} else {
						this.chapter.me.liked = 1
						this.chapter.like_count++
					}
				}).catch(e => {
					this.$u.toast('喜欢课时失败')
				})
			},
			popupConsultForm() {
				this.showConsultForm = true
			},
			onConsultFormOpened() {
				this.$refs.consultForm.setRules(this.consultRules)
			},
			changePrivate(name) {
				this.private.value = (name == '是') ? 1 : 0
			},
			submitConsult() {
				this.$refs.consultForm.validate(valid => {
					if (valid) {
						this.$api.createConsult({
							chapter_id: this.chapter.id,
							question: this.consultForm.question,
							private: this.private.value,
						}).then(res => {
							this.consultForm.question = ''
							this.showConsultForm = false
							this.$u.toast('提交咨询成功')
						}).catch(e => {
							this.$u.toast('更新资料失败')
						})
					}
				})
			},
			gotoCourse(id) {
				this.$utils.redirect('/pages/course/info', {
					id: id
				})
			},
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.learning.plan_id = res.chapter.me.plan_id
					this.learning.position = res.chapter.me.position
					this.initPlayer(res.chapter.play_urls)
				}).catch(e => {
					this.$u.toast('加载课时失败')
				})
			},
			loadConsults(id) {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getChapterConsults(id, params).then(res => {
					this.consults = this.consults.concat(res.pager.items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载咨询失败')
				})
			}
		}
	}
</script>

<style>
	.sticky {
		background-color: #FFFFFF;
	}

	.player {
		width: 750rpx;
		height: 422rpx;
		margin-bottom: 30rpx;
	}

	.action {
		display: flex;
		justify-content: flex-end;
	}

	.action .u-icon {
		margin-left: 30rpx;
	}

	.consult-form {
		padding: 30rpx;
	}
</style>
