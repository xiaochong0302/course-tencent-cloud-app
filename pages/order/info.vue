<template>
    <view class="container" v-if="order.sn">
        <view class="section">
            <u-section title="商品信息" :right="false"></u-section>
            <view class="item-course" v-if="order.item_type== 1">
                <view class="course">
                    <view class="title">课程 - {{ itemInfo.course.title }}</view>
                    <view class="meta">
                        <text>学习期限：{{ itemInfo.course.study_expiry }}个月</text>
                        <text>退款期限：{{ itemInfo.course.refund_expiry }}个月</text>
                    </view>
                    <view class="meta">
                        <text>市场价格：{{ itemInfo.course.market_price|formatPrice }}</text>
                        <text>会员价格：{{ itemInfo.course.vip_price|formatPrice }}</text>
                    </view>
                </view>
            </view>
            <view class="item-package" v-else-if="order.item_type== 2">
                <view class="course" v-for="course in itemInfo.package.courses" :key="course.id">
                    <view class="title">课程 - {{ course.title }}</view>
                    <view class="meta">
                        <text>学习期限：{{ course.study_expiry }}个月</text>
                        <text>退款期限：{{ course.refund_expiry }}个月</text>
                    </view>
                    <view class="meta">
                        <text>市场价格：{{ course.market_price|formatPrice }}</text>
                        <text>会员价格：{{ course.vip_price|formatPrice }}</text>
                    </view>
                </view>
            </view>
            <view class="item-vip" v-else-if="order.item_type== 4">
                <view class="title">会员服务</view>
                <view class="meta">
                    <text>价格：{{ itemInfo.vip.price|formatPrice }}</text>
                    <text>期限：{{ itemInfo.vip.expiry }}个月</text>
                </view>
            </view>
            <view class="item-vip" v-else-if="order.item_type== 99">
                <view class="title">支付测试</view>
            </view>
        </view>
        <view class="section">
            <u-section title="状态信息" :right="false"></u-section>
            <view class="status">
                <view class="meta" v-for="(item,index) in order.status_history" :key="index">
                    <view v-if="item.status == 1">创建时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                    <view v-if="item.status == 2">支付时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                    <view v-if="item.status == 3">完成时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                    <view v-if="item.status == 4">关闭时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                    <view v-if="item.status == 5">退款时间：{{ item.create_time|timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                </view>
            </view>
        </view>
        <view class="section">
            <u-section title="支付信息" :right="false"></u-section>
            <view class="stats">
                <view class="meta">订单编号：{{ order.sn }}</view>
                <view class="meta">创建时间：{{ order.create_time|date('yyyy-mm-dd hh:MM:ss') }}</view>
                <view class="meta">订单金额：{{ order.amount|formatPrice }}</view>
                <view class="meta">订单状态：{{ order.status|orderStatus }}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                order: {},
                itemInfo: {
                    course: {},
                    package: [],
                    vip: {},
                },
            }
        },
        onLoad(e) {
            this.loadOrderInfo(e.sn)
        },
        methods: {
            loadOrderInfo(sn) {
                this.$api.getOrderInfo(sn).then(res => {
                    this.order = res.order
                    this.itemInfo = res.order.item_info
                }).catch(e => {
                    this.$u.toast('加载订单失败')
                })
            },
        }
    }
</script>

<style>
    .container {
        padding: 30rpx;
    }

    .u-section {
        margin-bottom: 30rpx;
    }

    .section {
        margin-bottom: 30rpx;
    }

    .meta text {
        margin-right: 15rpx;
    }

    .course .title {
        margin-bottom: 15rpx;
    }

    .course .meta {
        margin-bottom: 15rpx;
    }

    .item-vip .title {
        margin-bottom: 15rpx;
    }

    .status .meta {
        margin-bottom: 15rpx;
    }

    .stats .meta {
        margin-bottom: 15rpx;
    }
</style>