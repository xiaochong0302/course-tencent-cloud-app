<template>
	<view class="container">
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-live" v-if="currentTab == 0">
				<view class="teacher-list">
					<teacher-list :teachers="teachers"></teacher-list>
				</view>
				<view class="load-more">
					<u-button size="medium" @click="gotoTeacherList">加载更多</u-button>
				</view>
			</view>
			<view class="tab-teacher" v-if="currentTab == 1">
				<view class="teacher-list">
					<teacher-list :teachers="teachers"></teacher-list>
				</view>
				<view class="load-more">
					<u-button size="medium" @click="gotoTeacherList">加载更多</u-button>
				</view>
			</view>
			<view class="tab-group" v-if="currentTab == 2">
				<view class="group-list">
					<group-list :groups="groups"></group-list>
				</view>
				<view class="load-more">
					<u-button size="medium" @click="gotoImGroupList">加载更多</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TeacherList from '@/components/teacher-list.vue'
	import GroupList from '@/components/group-list.vue'
	export default {
		components: {
			TeacherList,
			GroupList
		},
		data() {
			return {
				currentTab: 0,
				tabs: [{
					name: '直播'
				}, {
					name: '教师'
				}, {
					name: '群组'
				}],
				teachers: [],
				groups: [],
			}
		},
		onLoad() {
			this.loadTeachers()
			this.loadImGroups()
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			gotoTeacherList() {
				this.$utils.redirect('/pages/teacher/list')
			},
			gotoImGroupList() {
				this.$utils.redirect('/pages/im/group/list')
			},
			loadTeachers() {
				this.$api.getTeacherList().then(res => {
					this.teachers = res.pager.items
				}).catch(e => {
					this.$u.toast('加载教师失败')
				})
			},
			loadImGroups() {
				this.$api.getImGroupList().then(res => {
					this.groups = res.pager.items
				}).catch(e => {
					this.$u.toast('加载群组失败')
				})
			}
		}
	}
</script>

<style>
	.tab-title {
		margin-bottom: 50rpx;
	}

	.load-more {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;
	}
</style>
