<template>
    <view class="container" v-if="user.id > 0">
        <view class="user">
            <view class="avatar u-m-b-30">
                <u-avatar :src="user.avatar|thumbAvatar" :show-level="user.vip == 1" size="large"></u-avatar>
            </view>
            <view class="name u-m-b-30">{{ user.name }}</view>
            <view class="area u-m-b-30" v-if="user.area.length > 0">
                <u-icon name="map" :label="user.area"></u-icon>
            </view>
            <view class="active u-m-b-30" v-if="user.active_time > 0">
                <u-icon name="clock" :label="user.active_time|timeFrom"></u-icon>
            </view>
            <view class="about u-m-b-30">{{ user.about }}</view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                user: {}
            }
        },
        onLoad(e) {
            this.loadUserInfo(e.id)
        },
        methods: {
            loadUserInfo(id) {
                this.$api.getUserInfo(id).then(res => {
                    this.user = res.user
                }).catch(e => {
                    this.$u.toast('加载用户失败')
                })
            }
        }
    }
</script>

<style>
    .user {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 50rpx;
        margin-bottom: 30rpx;
    }

    .user .avatar {
        margin-bottom: 30rpx;
    }

    .user .name {
        margin-bottom: 30rpx;
    }

    .user .area {
        margin-bottom: 30rpx;
    }

    .user .active {
        margin-bottom: 30rpx;
    }
</style>