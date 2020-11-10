<template>
	<view class="container">
		<view class="review-list">
			<view class="review" v-for="item in items" :key="item.id">
				<view class="avatar">
					<image :src="item.owner.avatar" mode="aspectFit"></image>
				</view>
				<view class="info">
					<view class="top">
						<view class="name">{{ item.owner.name }}</view>
						<view class="rating">{{ item.rating }}</view>
					</view>
					<view class="content">{{ item.content }}</view>
					<view class="bottom"><text>{{ item.create_time }}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items:[],
				page: 1,
				hasMore: false,
				courseId: 0
			}
		},
		onLoad(e) {
			this.courseId = option.id
			this.loadReviews(option.id)
		},
		onReachBottom() {
			if (this.hasMore) {
				this.loadReviews()
			}
		},
		methods: {
			loadReviews() {
				let params = {}
				if (this.page > 0) {
					params.page = this.page
				}
				this.$api.getCourseReviews(this.courseId, params).then(res => {
					let items = this.items.concat(res.pager.items)
					this.items = this.handleReviews(items)
					this.hasMore = res.pager.total_pages > this.page
					this.page++
				}).catch(e => {
					this.$u.toast('加载评价失败')
				})
			},
			handleReviews(items) {
				return items
			}
		}
	}
</script>

<style>
	
</style>