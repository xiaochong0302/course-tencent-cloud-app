<template>
	<view>
		<u-section title="授课教师" :right="false"></u-section>
		<view class="item-list">
			<view class="item" v-for="teacher in teachers" :key="teacher.id" @click="gotoTeacher(teacher.id)">
				<view class="avatar">
					<u-image width="90" height="90" shape="circle" :src="teacher.avatar|thumbAvatar"></u-image>
				</view>
				<view class="info">
					<view class="name">{{ teacher.name }}</view>
					<view class="title">{{ teacher.title }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CourseTeacherList',
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
	.u-section {
		margin-bottom: 15rpx;
	}

	.item-list {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		padding: 15rpx 0;
	}

	.item .avatar {
		width: 90rpx;
		height: 90rpx;
		margin-right: 15rpx;
	}

	.item .info .name {
		color: $u-main-color;
		margin-bottom: 10rpx;
	}
	
	.item .info .title {
		color: $u-tips-color;
	}
</style>
