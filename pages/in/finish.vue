<template>
	<view class="login-container">
		<view class="login-nav-bar">
			<image class="arrow-back" @tap="backLogin" src="@/static/theme/default/nav_icon_back_black.png" mode="">
			</image>
			<view class="nav-bar-title">
				完善资料
			</view>
		</view>
		<view class="login-title">
			<image :src="( selectedAvatar || {} ).image_url || show_path" mode="" @click="chooseImage"></image>
			<!-- <avatar selWidth="600upx" selHeight="600upx" @upload="upload" :avatarSrc="show_path"
				avatarStyle="width: 200upx; height: 200upx; border-radius: 50%;">
			</avatar> -->
		</view>
		<view class="login-default-avatar">
			<view class="image-avatar">
				<view>
					<text class="avatar-title">可选默认头像:</text>
				</view>
				<image @click="selectedAvatar = item" class="avatar-option" :class="{active: (selectedAvatar || {}).image_url == item.image_url}" style="width: 80rpx;margin-right: 10rpx;height: 80rpx;" mode="aspectFit" v-for="item of defaultAvatar" :key="item.image_id" :src="item.image_url" />
			</view>
		</view>

		<view class="login-form">
			<view class="form-item">
				<input class="item-input" v-model="form.nickname" placeholder="请输入你的昵称(必填)" />
			</view>
		</view>
		<view class="sex-item">
			<view class="sex-box" :class="{'sex-active':sex == 0}" @tap="sex = 0">
				<text>男</text>
				<image src="/static/login/man.png" mode=""></image>
			</view>
			<view class="sex-box" :class="{'sex-active':sex == 1}" @tap="sex = 1">
				<text>女</text>
				<image src="/static/login/woman.png" mode=""></image>
			</view>
		</view>
		<button :class="['landing',checkIn ? 'landing_true' : 'landing_false']" :disabled="checkIn ? false : true"
			class="zai-btn" @tap="subReg">下一步</button>
	</view>
</template>

<script>
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
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
				defaultAvatar: [],
				selectedAvatar: null,
				form: {
					nickname: '',
					password: '',
					client_id: '',
					type: 'REGISTER',
					sex: 1,
				},
				sex: 1, // sex 0=男 1=女
				show_path: require('@/static/login/avatar.png'),
				my_avatar: '',
			}
		},
		components: {
			avatar
		},
		watch: {
			selectedAvatar() {
				console.log('this:', this.selectedAvatar);
			}
		},
		onLoad(option) {
			this.form.username = option.username;
			this.form.password = option.password;
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
				
				if ( res.default_avatar ) {
					_this.defaultAvatar = res.default_avatar;
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
					.username.length > 5 && this.form.nickname && (this.my_avatar || this.selectedAvatar);
			}
		},
		methods: {
			chooseImage() {
				let _this = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(JSON.stringify(res));
						_this.uploadFile(res.tempFilePaths[0]);
					}
				});
			},
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
				uni.showLoading({
					title: '注册中'
				})
				_this.form.sex = this.sex;
				if (_this.selectedAvatar) {
					_this.form.image_id = _this.selectedAvatar.image_id;
				}
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
									// _this.$refs.popup.open();
									uni.reLaunch({
										url: '../chat/index',
									});
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
			},
			upload(e) {
				console.log("e", e);
				return
				this.show_path = e.path;
				this.send();
			},
			uploadFile(local_url) {
				let uploadTask = uni.uploadFile({
					url: getApp().globalData.http_url + '/im/in/photo',
					filePath: local_url,
					name: 'file',
					/** formData必须要有值，否则会上传失败 */
					formData: {
						username: this.form.username
					},
					success: (res) => {
						console.log("res", res);
						this.show_path = local_url;
						this.my_avatar = local_url;

					},
					fail(err) {
						console.log("err", err);
						uni.showToast({
							icon: 'none',
							title: '上传失败'
						})
					}
				});
			},
			send() {
				let _this = this;
				uni.showLoading();
				_this.$httpSendFile({
					local_url: _this.show_path,
					type: 1,
					success(data) {
						/** 更新头像上传状态 */
						_this.$httpSend({
							path: '/im/in/photo',
							data: {
								username: _this.form.username,
							},
							success(data) {
								/** 更改头像后,更新下头像 */
								let user_info = _data.data('user_info');
								user_info.photo = user_info.photo.replace(/(\?_=)[\d\.]+$/, '$1' + Math
									.random());
								_data.data('user_info', user_info);
								uni.$emit('data_user_info', user_info);
								uni.hideLoading();

								uni.showToast({
									title: '更换成功',
									duration: 1000,
								});
							}
						});
					},
				});
			}

		}
	}
</script>

<style scoped lang="scss">
	.uni-input-placeholder {
		color: #ccc !important;
	}

	.sex-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		box-sizing: border-box;
		width: 300rpx;
		margin: 60rpx auto;
	}

	.sex-box {
		height: 80rpx;
		width: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 40rpx;
		background: #efefef;

		text {
			font-size: 14px;
			color: #aaa;
			margin-right: 20rpx;
		}

		image {
			width: 20px;
			height: 20px;
		}
	}

	.sex-active {
		background-color: #598fef;

		text {
			color: #fff;
		}
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
		justify-content: center;
		width: 100vw;
		left: 0;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);

		/* #endif */
		.arrow-back {
			width: 44rpx;
			height: 44rpx;
			position: absolute;
			left: 20rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.nav-bar-title {
			font-size: 20px;
			font-weight: bold;
			width: 100%;
			text-align: center;
			line-height: 44px;
			height: 100%;
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
					flex: 1;
					text-align: center;
					font-size: 16px;
					color: #000;

				}
			}
		}

		.login-title {
			padding-top: 250rpx;
			font-size: 24px;
			font-weight: bold;
			padding-bottom: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
			}
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
		background: #598fef;
		border: 0;
		border-radius: 50rpx;
		font-size: 16px;
		color: #fff;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 400rpx;
		margin: 0 auto;
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
		
	.image-avatar {
		.avatar-title {
			font-size: 16rpx;
			margin-bottom: 10rpx;
		}
		
		.avatar-option {
			&.active {
				padding: 8rpx;
				background: rgba(88, 39, 235, .5);
				border-radius: 100%;
				box-sizing: border-box;
			}
		}
	}
	
</style>
