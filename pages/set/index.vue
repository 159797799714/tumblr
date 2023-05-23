<template>
	<view class="page">

		<uni-list>
			<uni-list-item title="登录密码修改" :show-arrow="true" :show-badge="true" @click="goPath('../set/password')" />


			<uni-list-item :title="'清除缓存'+'  '+currentSize" :show-arrow="true" :show-badge="true" @click="clearTmp" />

			<uni-list-item title="清空所有聊天记录" :show-arrow="true" :show-badge="true" @click="clearAll" />

			<!-- <uni-list-item title="切换语言" :show-arrow="true" :show-badge="true" @click="goPath('../set/password')" /> -->
			<uni-list-item title="聊天字体" :show-arrow="true" :show-badge="true" @click="goPath('../set/font_size')" />


			<uni-list-item title="一键转发" :show-arrow="true" :show-badge="true"
				@click="goPath('/pages/push/create_group')" />


			<!--	<uni-list-item title="更新介绍" :show-arrow="true" :show-badge="true" @click="goPath('../set/password')" />-->
		</uni-list>
		<uni-list>
			<uni-list-item title="关于我们" :show-arrow="true" :show-badge="true"
				@click="goPath('/pages/user_info/system')" />
		</uni-list>


		</uni-list>

		<view class="uni-padding-wrap uni-common-mt login_out">
			<button type="primary" class="but-view" @tap="loginOut">退出登录</button>
		</view>
	</view>
</template>

<script>
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _action from '../../common/_action';
	import _mixins from '@/common/_mixins';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';

	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: {},
				currentSize: ''
			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
			});
			this.getStorage();
		},
		onLoad() {
			let _this = this;
			_this.my_data = _data.data('user_info');
		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {

		},
		methods: {
			// 查看缓存
			getStorage() {
				try {
					const res = uni.getStorageInfoSync();
					console.log(res.keys);
					console.log(res.currentSize);
					console.log(res.limitSize);
					// this.currentSize = res.currentSize + 'kb';
				} catch (e) {
					// error
				}
			},
			// 清除缓存
			clearTmp() {
				uni.showModal({
					title: '提示',
					content: '确定要清除吗?',
					confirmText: '确认',
					cancelText: '取消',
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '清除中',
								mask: true
							});
							try {
								// todo保留token,client_id
								let token = _data.localData('token');
								let client_id = _data.localData('client_id');
								let deviceId = _data.localData('deviceId');
								uni.clearStorageSync();
								uni.hideLoading();
								_data.localData('token', token);
								_data.localData('client_id', client_id);
								_data.localData('deviceId', deviceId);
								uni.showToast({
									title: '清除完毕',
									icon: 'none'
								});

							} catch (e) {
								// error
								uni.hideLoading()
								uni.showToast({
									title: '清除失败',
									icon: 'none'
								});
							}
						}
					},
				})



			},
			// 清空所有聊天记录
			clearAll() {
				let _this = this;
				uni.showModal({
					title: '重要提示',
					content: '确定要清空所有聊天记录吗?',
					confirmText: '确认',
					cancelText: '取消',
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/remove/del_all',
								success: function(data) {
									uni.showToast({
										icon: 'none',
										title: '清除成功'
									})
									_data.localData('chat_list', []);
									uni.$on('data_chat_list', []);
								}
							})
						}
					}
				})

			},
			loginOut() {
				/** 跳转到登陆界面 */
				_action.checkFail()
				uni.reLaunch({
					url: '/pages/in/login'
				});
			},
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					});
				}
			},
		},
		watch: {

		},
	}
</script>

<style>
	.login_out {
		margin-top: 100upx;
	}

	.phto {
		width: 130upx;
		height: 130upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}

	.my_padding {
		padding-bottom: 25px;
	}

	.but-view {
		border-radius: 40upx;
		height: 80upx;
		text-align: center;
		line-height: 80upx;
		font-size: 16px;
		;
	}

	.my_padding:before {
		background-color: white;
	}

	.uni-list {
		margin-bottom: 30upx;
	}
</style>
