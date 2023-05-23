<template>
    <view class="page">
        <view class="page-content" style="margin-top: 1px;">
            <uni-list class="page-list">
                <!-- 水平排列，右图左文 -->
                <uni-list-item :showArrow="false" class="page-list-item invite-list" :thumb="staticPhoto+item.photo+'?_='+imgRan" :title="item.nickname"
                               v-for="(item,index) in list">
                </uni-list-item>
            </uni-list>
        </view>
    </view>
</template>

<script>
    import _get from "../../common/_get";
    import _data from "../../common/_data";
    import _hook from "../../common/_hook";

    export default {
        data() {
            return {
                list: [
                ]
            }
        },
        computed: {
            staticPhoto(){
            	return _data.staticPhoto();
            },
            imgRan(){
            	return Math.random();
            },
        },
        onShow() {
            let _this = this;
            _hook.routeSonHook();
            _get.getMyInviteList({}, function (ret) {
                _this.list = ret
            });
        },
        methods: {
        }
    }
</script>

<style>
    .page-head-img {
        height: 200px;
        width: 100%;
    }

    uni-view {
        line-height: normal !important;
    }
	
	.invite-list .uni-text{
		font-size: 16px;
	}
</style>
