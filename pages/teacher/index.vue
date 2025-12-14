<template>
    <view class="container" v-if="teacher.id > 0">
        <view class="user">
            <view class="avatar u-m-b-30">
                <u-avatar :src="teacher.avatar|thumbAvatar" size="large"></u-avatar>
            </view>
            <view class="name u-m-b-30">{{ teacher.name }}</view>
            <view class="area u-m-b-30" v-if="teacher.area.length > 0">
                <u-icon name="map" :label="teacher.area"></u-icon>
            </view>
            <view class="active u-m-b-30" v-if="teacher.active_time > 0">
                <u-icon name="clock" :label="teacher.active_time|timeFrom"></u-icon>
            </view>
            <view class="about u-m-b-30">{{ teacher.about }}</view>
        </view>
        <view class="course">
            <view class="header">
                <u-section title="主讲课程" :right="false"></u-section>
            </view>
            <view class="body" v-if="courseList.items.length > 0">
                <course-list :items="courseList.items"></course-list>
            </view>
            <u-loadmore :status="courseList.loadMore" v-if="courseList.items.length > 0"></u-loadmore>
            <u-empty :show="courseList.showEmpty" margin-top="100"></u-empty>
        </view>
    </view>
</template>

<script>
    import CourseList from '@/components/course-list.vue'
    export default {
        components: {
            CourseList
        },
        data() {
            return {
                teacher: {},
                courseList: {
                    items: [],
                    page: 1,
                    hasMore: false,
                    loadMore: 'loadmore',
                    showEmpty: false,
                },
            }
        },
        onLoad(e) {
            this.loadTeacherInfo(e.id)
            this.loadTeacherCourses(e.id)
        },
        onReachBottom() {
            if (this.courseList.hasMore) {
                this.loadTeacherCourses(this.teacher.id)
            }
        },
        methods: {
            loadTeacherInfo(id) {
                this.$api.getTeacherInfo(id).then(res => {
                    this.teacher = res.teacher
                }).catch(e => {
                    this.$u.toast('加载教师失败')
                })
            },
            loadTeacherCourses(id) {
                let params = {}
                if (this.courseList.page > 0) {
                    params.page = this.courseList.page
                }
                this.$api.getTeacherCourses(id, params).then(res => {
                    this.courseList.items = this.courseList.items.concat(res.pager.items)
                    this.courseList.hasMore = res.pager.total_pages > this.courseList.page
                    this.courseList.loadMore = this.courseList.hasMore ? 'loadmore' : 'nomore'
                    this.courseList.showEmpty = this.courseList.page == 1 && res.pager.total_pages == 0
                    this.courseList.page++
                }).catch(e => {
                    this.$u.toast('加载课程失败')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .user {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50rpx;
        margin-bottom: 30rpx;
    }

    .course {
        margin-bottom: 100rpx;
    }

    .course .header {
        margin-bottom: 30rpx;
    }

    .course .body {
        margin-bottom: 50rpx;
    }
</style>