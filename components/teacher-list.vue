<template>
	<view class="item-list">
		<view class="item" v-for="teacher in teachers" :key="teacher.id" @click="gotoTeacher(teacher.id)">
			<view class="avatar">
				<u-image :src="teacher.avatar|thumbAvatar" width="100" height="100" shape="circle"></u-image>
			</view>
			<view class="info">
				<view class="title">{{ teacher.name }}</view>
				<view class="meta">{{ teacher.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TeacherList',
		props: {
			items: {
				type: Array
			}
		},
		data() {
			return {
				teachers: []
			}
		},
		created() {
			this.teachers = this.handleTeachers(this.items)
		},
		watch: {
			items: function() {
				this.teachers = this.handleTeachers(this.items)
			}
		},
		methods: {
			gotoTeacher(id) {
				this.$utils.redirect('/pages/teacher/index', {
					id: id
				})
			},
			handleTeachers(teachers) {
				return teachers.map(teacher => {
					if (teacher.title == '') {
						teacher.title = '小小书匠'
					}
					return teacher
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-list {
		display: flex;
		flex-wrap: wrap;
	}

	.item {
		display: flex;
		width: 320rpx;
		margin-left: 30rpx;
		margin-bottom: 30rpx;
	}

	.item .avatar {
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.item .title {
		color: $u-main-color;
		margin-bottom: 15rpx;
	}

	.item .meta {
		color: $u-tips-color;
		margin-bottom: 15rpx;
	}
</style>
