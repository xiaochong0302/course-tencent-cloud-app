<template>
	<view class="container">
		<view class="option-list" v-if="options.length > 0">
			<view class="option" v-for="option in options" :key="option.id">
				<u-button type="primary" size="medium" @click="rewardCourse(option.id)">{{ option.title }}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				course: {},
				options: [],
			}
		},
		onLoad(e) {
			this.course.id = e.id
			this.loadOptions()
		},
		methods: {
			rewardCourse(optionId) {
				this.$utils.redirect('/pages/order/confirm', {
					item_id: `${this.course.id}-${optionId}`,
					item_type: 3,
				})
			},
			loadOptions() {
				this.$api.getRewardOptions().then(res => {
					this.options = res.options
				}).catch(e => {
					this.$u.toast('加载选项失败')
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 50rpx;
	}

	.option-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.option {
		margin-bottom: 30rpx;
	}

	.option .u-btn {
		padding-left: 30rpx;
		padding-right: 30rpx;
		min-width: 180rpx;
	}
</style>
