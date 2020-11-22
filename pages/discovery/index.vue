<template>
	<view class="container">
		<view class="tab-title">
			<u-tabs :list="tabs" :is-scroll="false" :current="currentTab" @change="changeTab"></u-tabs>
		</view>
		<view class="tab-content">
			<view class="tab-live" v-if="currentTab == 0">
				<view class="live-list" v-if="lives.length > 0">
					<live-list :items="lives"></live-list>
				</view>
				<view class="load-more" @click="gotoLiveList" v-if="lives.length > 10">加载更多</view>
			</view>
			<view class="tab-teacher" v-if="currentTab == 1">
				<view class="teacher-list" v-if="teachers.length > 0">
					<teacher-list :items="teachers"></teacher-list>
				</view>
				<view class="load-more" @click="gotoTeacherList" v-if="teachers.length > 10">加载更多</view>
			</view>
			<view class="tab-group" v-if="currentTab == 2">
				<view class="group-list" v-if="groups.length > 0">
					<group-list :items="groups"></group-list>
				</view>
				<view class="load-more" @click="gotoGroupList" v-if="groups.length > 10">加载更多</view>
			</view>
		</view>
	</view>
</template>

<script>
	import LiveList from '@/components/live-list.vue'
	import TeacherList from '@/components/teacher-list.vue'
	import GroupList from '@/components/group-list.vue'
	export default {
		components: {
			LiveList,
			TeacherList,
			GroupList,
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
				lives: [],
				teachers: [],
				groups: [],
			}
		},
		onLoad() {
			this.loadLives()
			this.loadTeachers()
			this.loadGroups()
		},
		methods: {
			changeTab(index) {
				if (this.currentTab != index) {
					this.currentTab = index
				}
			},
			gotoLiveList() {
				this.$utils.redirect('/pages/live/list')
			},
			gotoTeacherList() {
				this.$utils.redirect('/pages/teacher/list')
			},
			gotoGroupList() {
				this.$utils.redirect('/pages/im/group/list')
			},
			loadLives() {
				this.$api.getLiveList().then(res => {
					this.lives = res.pager.items
				}).catch(e => {
					this.$u.toast('加载直播失败')
				})
			},
			loadTeachers() {
				this.$api.getTeacherList().then(res => {
					this.teachers = res.pager.items
				}).catch(e => {
					this.$u.toast('加载教师失败')
				})
			},
			loadGroups() {
				this.$api.getImGroupList().then(res => {
					this.groups = res.pager.items
				}).catch(e => {
					this.$u.toast('加载群组失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab-title {
		margin-bottom: 30rpx;
	}

	.load-more {
		color: $u-tips-color;
		text-align: center;
		margin-bottom: 30rpx;
	}
</style>
