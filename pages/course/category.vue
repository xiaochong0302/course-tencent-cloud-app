<template>
	<view class="container">
		<view class="top-list" v-if="categories.length > 0">
			<view v-for="top in categories" :key="top.id">
				<view class="section">
					<u-section :title="top.name" :right="false"></u-section>
				</view>
				<view class="sub-list">
					<u-tag v-for="sub in top.children" :key="sub.id" :text="sub.name" type="info" mode="plain" shape="circle" @click="gotoCourseList(sub.id)"></u-tag>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: []
			}
		},
		onLoad() {
			this.loadCategories()
		},
		methods: {
			loadCategories() {
				this.$api.getCourseCategories().then(res => {
					this.categories = res.categories
				}).catch(e => {
					this.$u.toast('加载分类失败')
				})
			},
			gotoCourseList(sc) {
				this.$utils.redirect('/pages/course/list', {
					sc: sc
				})
			}
		}
	}
</script>

<style>
	.section {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
	}

	.sub-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.sub-list .u-tag {
		margin-bottom: 15rpx;
		margin-right: 15rpx;
	}
</style>
