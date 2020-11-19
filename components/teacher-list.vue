<template>
	<view class="item-list">
		<view class="item" v-for="teacher in teachers" :key="teacher.id" @click="gotoTeacher(teacher.id)">
			<view class="avatar">
				<u-image width="120" height="120" shape="circle" :src="teacher.avatar|thumbAvatar"></u-image>
			</view>
			<view class="info">
				<view class="name">{{ teacher.name }}</view>
				<view class="title">{{ teacher.title }}</view>
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
	.item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.item .avatar {
		margin-right: 15rpx;
	}

	.item .info {
		flex: 1;
	}

	.item .name {
		margin-bottom: 15rpx;
	}
</style>
