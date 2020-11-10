<template>
	<view class="body">
		<view v-if="chapter.model == 1">
			<view></view>
		</view>
		<view v-if="chapter.model == 1">
			<view></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chapter: {}
			}
		},
		onLoad(e) {
			loadChapter(e.id)
		},
		methods: {
			loadChapter(id) {
				this.$api.getChapterInfo(id).then(res => {
					this.chapter = res.chapter
				}).catch(e => {
					this.$u.toast(e.msg)
				})
			}
		}
	}
</script>

<style>

</style>
