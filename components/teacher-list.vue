<template>
	<view class="item-list">
		<view class="item" v-for="teacher in showTeachers" :key="teacher.id" @click="gotoTeacher(teacher.id)">
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
			items: {
				type: Array
			}
		},
		created() {
			this.showTeachers = this.handleTeachers(this.items)
		},
		watch: {
			items: function() {
				this.showTeachers = this.handleTeachers(this.items)
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
	.item-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 240rpx;
		margin-bottom: 50rpx;
		text-align: center;
		overflow: hidden;
	}

	.item .avatar {
		margin-bottom: 15rpx;
	}

	.item .name {
		margin-bottom: 15rpx;
	}
</style>
