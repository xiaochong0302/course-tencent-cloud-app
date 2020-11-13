<template>
	<view class="teacher-list">
		<view class="teacher" v-for="teacher in showTeachers" :key="teacher.id" @click="gotoTeacher(teacher.id)">
			<view class="avatar">
				<u-image width="120" height="120" shape="circle" :src="teacher.avatar|thumbAvatar"></u-image>
			</view>
			<view class="name u-line-1">{{ teacher.name }}</view>
			<view class="title u-line-1">{{ teacher.title }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TeacherList',
		data() {
			return {
				showTeachers: []
			}
		},
		props: {
			teachers: {
				type: Array
			}
		},
		created() {
			this.showTeachers = this.handleTeachers(this.teachers)
		},
		watch: {
			teachers: function() {
				this.showTeachers = this.handleTeachers(this.teachers)
			}
		},
		methods: {
			gotoTeacher(id){
				this.$utils.redirect(`/pages/teacher/index?id=${id}`)
			},
			handleTeachers(teachers) {
				return teachers.map(teacher => {
					if (teacher.title == '') {
						teacher.title = '小小教书匠'
					}
					return teacher
				})
			}
		}
	}
</script>

<style>
	.teacher-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.teacher {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 240rpx;
		margin-bottom: 50rpx;
		text-align: center;
		overflow: hidden;
	}

	.teacher .avatar {
		margin-bottom: 15rpx;
	}

	.teacher .name {
		margin-bottom: 15rpx;
	}
</style>
