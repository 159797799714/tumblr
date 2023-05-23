<template>
	<view class="page-container">
		<view class="center-image">
			<image class="" src="/static/my/group.png" mode="widthFix"></image>
		</view>
		<view class="tips">
			<text>您可以通过群发助手，</text>
			<text>将消息一件发送给200个好友，省时高效</text>
		</view>
		<view class="new_add">
			<button @click="goPath" class="new_add_btn">&nbsp;&nbsp;+&nbsp;&nbsp;新建群发</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goPath() {
				uni.navigateTo({
					url: '/pages/push/sendall'
				})
			},
		}
	}
</script>

<style scoped>
	.new_add {
		margin: 10rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.new_add_btn {
		height: 80rpx;
		padding: 0 100rpx;
		border-radius: 40rpx;
		background: #5ed19a;
		color: #fff;
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tips {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90vw;
		margin: 0 auto;
		margin-bottom: 60rpx;
	}

	.tips text {
		font-size: 14px;
		font-weight: bold;
		color: #000;
	}

	.page-container {
		background: #fff;
		min-height: 100vh;
	}

	.center-image {
		width: 94vw;
		height: auto;
		margin: 0 auto;
		padding-top: 200rpx;
		padding-bottom: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.center-image image {
		width: 100%;
		height: auto;
	}
</style>
