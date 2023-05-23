<template>
	<view class="page">
		<view class="content">
			<view class="wallet-card">
				<view class="">
					<text class="white f12">账户余额</text>
				</view>
				<view class="">
					<text class="f30 white fw">{{my_data.money?my_data.money:0.00}}</text><text
						class="white f12">元</text>
				</view>
				<view class="wallet-btn-group">
					<button @tap="goPath('charge')">
						<text>充值</text>
					</button>
					<button @tap="goPath('withdraw')">
						<text>提现</text>
					</button>
				</view>
			</view>
			<view class="more-card">
				<view class="more-item" @click="goPath('capital2')">
					<image src="/static/theme/default/my/bill_new_icon.png" mode="heightFix"></image>
					<text>账单明细</text>
				</view>
				<view class="more-item" @click="goPath('capital?type=hongbao')">
					<image src="/static/theme/default/my/red_new_icon.png" mode=""></image>
					<text>红包明细</text>
				</view>
				<view class="more-item" @click="goPath('alipay_set')">
					<image src="/static/theme/default/my/bank_card_icon.png" mode=""></image>
					<text>提现设置</text>
				</view>
				<view class="more-item" @click="goPath('trade_password')">
					<image src="/static/theme/default/my/pwd_icon.png" mode=""></image>
					<text>密码设置</text>
				</view>
				<view class="more-item" @click="goPath('/pages/my/pay/pay')">
					<image src="/static/theme/default/my/pwd_icon.png" mode=""></image>
					<text>收付款</text>
				</view>
			</view>
		</view>
		<view class="wallet-tips">
			<text @tap="goPath('/pages/article/article')">帮助中心</text>
			<view class="">
				《 用户服务协议》《 隐私政策》
			</view>
			<!--<text class="gray f12">本服务由首信易支付提供</text>-->
			
		</view>
	</view>
</template>
<style lang="scss">
	.wallet-tips {
		display: flex;
		flex-direction: column;
		margin-top: 80rpx;
		align-items: center;

		.tips {
			font-size: 30rpx;
		}

		.f12 {
			font-size: 24rpx;
		}

		.gray {
			color: gray;
		}
	}

	.more-card {
		width: 94vw;
		margin: 20rpx auto;
		border-radius: 40rpx;
		box-sizing: border-box;
		background: #ffff;
		box-shadow: 0 0 10rpx 2rpx rgba(0, 0, 0, 0.05);
		display: flex;
		flex-wrap: wrap;

		.more-item {
			width: 33.33%;
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 50rpx;
				height: 50rpx;
			}

			text {
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #000;
			}
		}
	}

	.wallet-card {
		width: 94vw;
		margin: 20rpx auto;
		border-radius: 40rpx;
		box-sizing: border-box;
		padding: 20rpx 40rpx;
		height: 300rpx;
		background: linear-gradient(to right, #00db93, #00dc92);

		.white {
			color: #fff;
		}

		.fw {
			font-weight: bold;
		}

		.f30 {
			font-size: 60rpx;
		}

		.f12 {
			font-size: 24rpx;
		}

		.wallet-btn-group {
			display: flex;
			align-items: center;
			height: 100rpx;
			justify-content: flex-start;

			button {
				height: 80rpx;
				border-radius: 80rpx;
				width: 180rpx;
				color: #00dc92;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				background: #fff;
				margin-right: 40rpx;
				margin-left: 0;
			}
		}
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.img {
		display: flex;
		;
		height: 440upx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #5693ee;
		width: 100%;
	}

	.img image {
		width: 140upx;
		height: 150upx;
	}

	.img text {
		color: white;
		font-size: 20px;
	}

	.content .withdraw {
		width: 95%;
		background-color: #5693ee;
		color: white;
		margin-top: 10upx;
		height: 80upx;
		line-height: 80upx !important;
		font-size: 36upx;
		cursor: pointer;
	}

	.content .charge {
		background-color: white;
		color: #5693ee;
		border: 1px solid #5693ee;
	}

	.content .list {
		margin-top: 20upx;
	}

	.uni-page-head {
		box-sizing: content-box !important;
	}
</style>
<script>
	import uniList from '../../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';

	export default {
		components: {
			uniList,
			uniListItem,
		},
		data() {
			return {
				my_data: {},
			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			_get.getUserInfo({});
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
				console.log('更新用户数据....')
				_data.data('user_info', data)
			});
			_this.my_data = _data.data('user_info');
			console.log(_this.my_data)
		},
		onLoad() {

		},
		onUnload() {},
		computed: {},
		methods: {
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
		},
		watch: {

		},
	}
</script>
