<template>
	<view class="body">
		<view class="player" id="player"></view>
	</view>
</template>

<script>
	import {
		TcPlayer
	} from '@/common/tcplayer.js'
	export default {
		data() {
			return {
				chapter: {},
				player: null,
			}
		},
		onLoad(e) {
			this.loadChapter(e.id)
		},
		methods: {
			initPlayer(playUrls) {
				let options = {
					autoplay: false
				}
				if (playUrls.od) {
					options.m3u8 = playUrls.od.url
					options.width = playUrls.od.width
					options.height = playUrls.od.height
				}
				if (playUrls.hd) {
					options.m3u8_hd = playUrls.hd.url
					options.width = playUrls.hd.width
					options.height = playUrls.hd.height
				}
				if (playUrls.sd) {
					options.m3u8_sd = playUrls.sd.url
					options.width = playUrls.sd.width
					options.height = playUrls.sd.height
				}
				options.listener = (msg) => {
					if (msg.type === 'play') {
						this.onPlay()
					} else if (msg.type === 'pause') {
						this.onPause()
					} else if (msg.type === 'ended') {
						this.onEnded()
					}
				}
				this.player = new TcPlayer('player', options)
			},
			onPlay() {},
			onPause() {},
			onEnded() {},
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
					this.initPlayer(res.chapter.play_urls)
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			},
			getPlayUrl(playUrls, type = 'sd') {
				let result = ''
				if (playUrls[type]) {
					result = playUrls[type].url
				}
				return result
			}
		}
	}
</script>

<style>
	.player {
		width: 100%;
	}
</style>
