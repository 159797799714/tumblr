<template>
	<view class="login-container">
		<view class="login-nav-bar">
			<image class="arrow-back" @tap="backLogin" src="@/static/theme/default/nav_icon_back_black.png" mode="">
			</image>
		</view>
		<view class="login-title">注册用户</view>
		<view class="login-form">
			<view class="form-item">
				<text class="item-lable">用户名</text>
				<input class="item-input" v-model="form.username" placeholder="请输入用户名/手机号码" />
			</view>
			<view class="form-item">
				<text class="item-lable">输入密码</text>
				<input class="item-input" v-if="close_icon" type="password" v-model="form.password"
					placeholder="请输入密码" />
				<input class="item-input" v-else type="text" v-model="form.password" placeholder="请输入密码" />
				<view class="login-icon" @tap="close_icon = !close_icon">
					<image v-if="close_icon" src="@/static/login/close.png" mode=""></image>
					<image v-else src="@/static/login/open.png" mode=""></image>
				</view>
			</view>
			<navigator url="./login" open-type='navigateBack' hover-class="none" class="zai-label">已有账号，点此去登录.
			</navigator>
			<button :class="['landing',checkIn ? 'landing_true' : 'landing_false']" :disabled="checkIn ? false : true"
				class="zai-btn" @tap="subReg">注册</button>
			<view class="login-bottom">
				<text class="tips" @tap="goPath">《使用条款和隐私政策》</text>
			</view>
		</view>
		<uni-popup ref="popup" type="confirm">
			<uni-popup-confirm title="温馨提示" :beforeClose="true" @close="close" :content="popuMsg" @confirm="confirm">
			</uni-popup-confirm>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue';
	import uniPopupConfirm from '../../components/uni-popup/uni-popup-confirm.vue';
	import _get from "../../common/_get";
	import _data from "../../common/_data";
	export default {
		data() {
			return {
				miaoqiang: 'tests',
				popuMsg: '恭喜您注册成功,是否立即更改资料?',
				showPassword: true,
				showText: true,
				second: 60,
				form: {
					mobileCode: 1,
					username: '',
					password: '',
					client_id: '',
					sms_code: '',
					type: 'REGISTER',
				},
				close_icon: true
			}
		},
		components: {
			uniPopup,
			uniPopupConfirm
		},
		onLoad() {

		},
		onShow() {
			console.log(this.form.mobileCode);
			let _this = this;
			_get.getSysConfig({}, function(res) {
				if (res.user_regiter_sms_status == 1) {
					_this.form.mobileCode = 1
				} else {
					_this.form.mobileCode = 0
				}
			})

			// #ifdef APP-PLUS
			plus.push.getClientInfoAsync(function(info) {
				_this.form.client_id = info.clientid;
			}, function(e) {
				console.log('Failed');
				console.log(JSON.stringify(e));
			});
			// #endif
		},
		computed: {
			checkIn() {
				return this.form.password != '' && this.form.username != '' && this.form.password.length > 5 && this.form
					.username.length > 5;
			}
		},
		methods: {
			backLogin() {
				uni.navigateBack({

				})
			},
			goPath() {
				uni.navigateTo({
					'url': '/pages/in/web'
				})
			},
			close() {
				let _this = this;
				uni.reLaunch({
					url: '../chat/index',
					success: function() {
						_this.$refs.popup.close();
					}
				});
			},
			confirm(e) {
				let _this = this;
				uni.redirectTo({
					url: '/pages/my/details',
					success: function() {
						_this.$refs.popup.close();
					}
				});
			},
			isPoneAvailable($poneInput) {
				let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
				if (!myreg.test($poneInput)) {
					return false;
				} else {
					return true;
				}
			},
			getCode() {
				let _this = this;
				if (this.form.username.trim() == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return false;
				}

				if (!this.isPoneAvailable(this.form.username.trim())) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return false;
				}
				_get.getSms({
					mobile: this.form.username,
					type: 'REGISTER'
				}, function(res) {
					console.log(22222)
					_this.cutDown();
				}, function(res) {
					console.log(1111)
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'none'
					});
				})
			},
			cutDown(val) { //倒计时
				//获取验证码
				this.showText = false;
				var interval = setInterval(() => {
					let times = --this.second;
					times = times < 0 ? 0 : times;
					this.second = times < 10 ? '0' + times : times //小于10秒补 0
				}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					this.second = 60
					this.showText = true
				}, 60000)
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
			subReg() {
				let _this = this;
				if (!_this.checkIn) {
					return;
				}
				if (!(/^\w{1,20}$/.test(this.form.username))) {
					uni.showModal({
						content: '密聊号只能包括下划线、数字、字母,并且不能超过20个',
					});
					return;
				}

				if (!(/^\w{1,20}$/.test(this.form.password))) {
					uni.showModal({
						content: '密码只能包括下划线、数字、字母,长度6-20位',
					});
					return;
				}
				let channelCode = _data.localData('xInstallChannelCode');
				if (channelCode) {
					_this.form.channel = channelCode;
				}
				/* uni.showModal({
				     content: "xxx2:"+channelCode,
				     showCancel: false,
				 }); */

				uni.navigateTo({
					url: './finish?username=' + _this.form.username + "&password=" + _this.form.password
				})
				return

				uni.showLoading({
					title: '注册中'
				})
				_this.$httpSend({
					path: '/im/in/reg',
					data: _this.form,
					success: (data) => {
						uni.setStorage({
							key: 'token',
							data: data.token,
							fail: () => {
								uni.showModal({
									content: '本地存储数据不可用!',
								});
							},
							success() {
								_this.$socketSend({
									action: 'checkToken',
									data: data.token,
								}, function() {
									uni.hideLoading();
									_this.$refs.popup.open();
									// uni.reLaunch({
									// 	url: '../chat/index',
									// });
								})

							},
						});
					}
				});
			},
			go_forget() {
				uni.navigateTo({
					url: '../../pages/in/forget'
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

<style scoped lang="scss">
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

	.login-nav-bar {
		height: 44px;
		display: flex;
		align-items: center;
		position: absolute;
		justify-content: flex-start;
		left: 0;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);

		/* #endif */
		.arrow-back {
			width: 44rpx;
			height: 44rpx;
			margin-left: 20rpx;
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

				.tips {
					font-size: 12px;
					color: #b5746c;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					width: 100%;
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
		margin-top: 114upx;
	}

	.zai-title {
		position: absolute;
		top: 0;
		line-height: 360upx;
		font-size: 68upx;
		color: #fff;
		text-align: center;
		width: 100%;
		margin-left: -100upx;
	}

	.zai-form {
		margin-top: 150upx;
	}

	.form-code {
		margin-top: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.form-code .code {
		height: 100%;
		border-radius: 50px;
		text-align: center;
		font-size: 14px;
		background: #ff65a3;
		color: #ffffff;
	}

	.zai-input {
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
	}

	.code-input {
		background: #e2f5fc;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 36upx;
		width: 40%;
	}

	.input-placeholder,
	.zai-input {
		color: #94afce;
	}

	.zai-label {
		text-align: center;
		font-size: 30upx;
		color: #666;
		height: 100rpx;
		display: flex;
		align-items: center;
		text-align: left;
	}

	.zai-btn {
		background: #74c6c0;
		border: 0;
		border-radius: 50rpx;
		font-size: 16px;
		color: #fff;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.zai-btn:after {
		border: 0;
	}

	/*按钮点击效果*/
	.zai-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	.zai-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #a7b6d0;
		padding-top: 10px;
	}
</style>
