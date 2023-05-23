<template>
	<view class="login-container">
		<view class="login-title">密码登录</view>
		<view class="login-form">
			<view class="form-item">
				<text class="item-lable">用户名</text>
				<input class="item-input" type="text" v-model="form.username" placeholder="请输入用户名/手机号码" />
			</view>
			<view class="form-item">
				<text class="item-lable">输入密码</text>
				<input class="item-input" v-if="close" type="password" v-model="form.password" placeholder="请输入密码" />
				<input class="item-input" v-else type="text" v-model="form.password" placeholder="请输入密码" />
				<view class="login-icon" @tap="close = !close">
					<image v-if="close" src="@/static/login/close.png" mode=""></image>
					<image v-else src="@/static/login/open.png" mode=""></image>
				</view>
			</view>
			<button class="login-btn" @tap="subLongin">登录</button>
			<view class="login-bottom">
				<text class="login-random" @tap="mabtn">游客登录</text>
				<navigator class="login-random" url="./reg" hover-class="none">注册用户</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import _data from "../../common/_data";
	import _mixins from "../../common/_mixins";
	import _get from "../../common/_get";
	import _page from "../../common/common";
	import SDK from "../../common/tendenceImSdk";
	export default {
		data() {
			return {
				showPassword: true,
				form: {
					username: '',
					password: '',
					client_id: ''
				},
				close: true,
			}
		},
		onLoad() {

		},
		onShow() {
			//获取用户手机号
			//#ifdef APP-PLUS
			// let phone = _page.getSystemPhone();
			let _this = this;
			plus.push.getClientInfoAsync(function(info) {
				_this.form.client_id = info.clientid;
				console.log(JSON.stringify(info));
			}, function(e) {
				console.log('Failed');
				console.log(JSON.stringify(e));
			});

			// plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			// 	addressbook.find(null, function(contacts) {
			// 		_get.sendContact({params:JSON.stringify(contacts),client_id:_this.clientid,phone:phone},function(res){
			// 			console.log(res);
			// 		});

			// 	}, function() {
			// 	}, {
			// 		multiple: true
			// 	});
			// }, function(e) {
			// });
			// #endif
		},
		computed: {
			checkIn() {
				return this.form.password != '' && this.form.username != '' && this.form.password.length > 5;
			}
		},
		methods: {
			//忘记密码
			// fogetPassword(){
			// 	uni.navigateTo({
			// 		url:"forget"
			// 	})
			// },
			//游客登录
			mabtn() {
				let _this = this;
				console.log('666')
				uni.showLoading({
					title: '登陆中'
				})
				this.form.client_id = _data.localData('client_id');
				let channelCode = _data.localData('xInstallChannelCode');
				if (channelCode) {
					this.form.channel = channelCode;
				}

				_this.$httpSend({
					path: '/im/in/reg_tourist',
					data: _this.form,
					success: (data) => {
						console.log('sucess', data.token)
						try {
							uni.setStorageSync('token', data.token);
						} catch (e) {
							uni.showModal({
								content: '本地存储数据不可用!',
							});
							uni.hideLoading()
							return false;
						}
						console.log('连接websocket')
						//登陆上去之后重新获取数据刷新页面
						_mixins.methods.$socketSend({
							action: 'checkToken',
							data: data.token,
						}, function() {
							uni.hideLoading()
							uni.reLaunch({
								url: '../chat/index',
							});
						});

					}
				});
				/* uni.navigateTo({
				 url:"frozen"
				}) */

			},
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUsernameText() {
				this.form.username = ''
			},
			delInputPasswordText() {
				this.form.password = ''
			},
			subLongin() {
				let _this = this;
				if (!_this.checkIn) {
					return false;
				}
				uni.showLoading({
					title: '登陆中'
				})
				this.form.client_id = _data.localData('client_id');
				_this.$httpSend({
					path: '/im/in/login',
					data: _this.form,
					success: (data) => {
						console.log('sucess', data.token)
						try {
							uni.setStorageSync('localLoginData', data);
							uni.setStorageSync('token', data.token);
						} catch (e) {
							uni.showModal({
								content: '本地存储数据不可用!',
							});
							uni.hideLoading()
							return false;
						}
						//登陆
						try {
							SDK.IMSDK.joinRoom(data, function(sdk_ret) {
								console.log("腾讯SDK登陆", sdk_ret);
							})
						} catch (e) {
							console.log("腾讯SDK登陆失败", e);
						}
						console.log('连接websocket')
						//登陆上去之后重新获取数据刷新页面
						_mixins.methods.$socketSend({
							action: 'checkToken',
							data: data.token,
						}, function() {
							uni.hideLoading()
							uni.reLaunch({
								url: '../chat/index',
							});
						});

					}
				});
			},
			go_forget() {
				uni.navigateTo({
					url: '../../pages/in/forget'
				})
			},
			go_frozen() {
				uni.navigateTo({
					url: '../../pages/set/frozen'
				})
			},
			go_register() {
				uni.navigateTo({
					url: '../../pages/in/reg'
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.uni-input-placeholder {
		color: #ccc !important;
	}

	input[type="password"]::-ms-reveal {
		display: none;
	}

	.login-icon {
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.login-container {
		background-color: #ffffff;
		height: 100vh;
		width: 100vw;
		padding: 0 60rpx;
		position: relative;
		box-sizing: border-box;
		background-image: url(@/static/login/bg.png);
		background-repeat: no-repeat;
		background-size: 100% auto;

		.login-form {
			display: flex;
			flex-direction: column;

			.login-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 100rpx;

				.login-random {
					text-decoration: none;
					color: #999;
					font-size: 14px;
				}
			}

			.login-btn {
				width: 100%;
				height: 100rpx;
				border-radius: 50px;
				background-color: #74c6c0;
				color: #fff;
				font-size: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 100rpx;
			}

			.login-btn.button-hover {
				transform: translate(1upx, 1upx);
			}

			.form-item {
				display: flex;
				height: 100rpx;
				align-items: center;
				border-bottom: 1px solid #eee;

				.item-lable {
					font-size: 16px;
					color: #333;
					width: 180rpx;
				}

				.item-input {
					border: none;
					outline: none;
					background: none;
					font-size: 16px;
					color: #000;
					height: 100%;
					flex: 1;
				}
			}
		}

		.login-title {
			padding-top: 250rpx;
			font-size: 24px;
			font-weight: bold;
			padding-bottom: 150rpx;
		}
	}







	.zai-viewl {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.zai-box {
		padding: 0 100upx;
		position: relative;
	}

	.zai-logo {
		width: 160upx;
		width: 160upx;
		height: 160upx;
		margin-top: 200upx;
	}

	.ke_btn {}

	.zai-title {
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
		margin-top: 120upx;
	}

	.zai-form {}

	.zai-input {
		background: none;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		padding: 60upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.zai-btn {
		background: #6dcef7;
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 36upx;
	}

	.zai-btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.forget {
		padding: 5px;
		text-align: right;
		font-size: 12px;
		color: #a7b6d0;
	}
</style>
