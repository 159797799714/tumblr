<template>
	<view class="page">
		<view class="list-footer" v-if="data.type == 1">
			<view class="yaoqing-menber">
				<view class="group-member-btn-box">
					<view class="group-member-btn" @tap="add">
						+
					</view>
					<text class="tip">添加</text>
				</view>
				<view class="group-member-btn-box">
					<view class="group-member-btn" @tap="reduce">
						-
					</view>
					<text class="tip">删除</text>
				</view>
			</view>
			<view class="member-list">
				<view class="member-item" v-for="(val,index) of data.member" :key="index" @tap="goDetails(val.user_id)" v-if="data.is_action != 0 || val.is_admin == 1 || val.is_admin == 2">
					<view class="item-left">
						<view class="item-left-img">
							<image :src="photo(val.photo+'')" :lazy-load="true" :data-index="index" @erro="imageError">
							</image>
						</view>
						<view class="item-text">
							<text>{{val.show_name}}</text>
							<text class="tag-admin" v-show="val.is_admin == 2">群主</text>
							<text class="tag-admin" v-show="val.is_admin == 1">管理员</text>
						</view>
					</view>
					<view class="item-right">
						<!-- <view class="item-right-img">
							<image src="/static/theme/default/qunzhu.png" v-show="val.is_admin == 2"></image>
							<image src="/static/theme/default/guanliyuan.png" v-show="val.is_admin == 1"></image>
						</view> -->
						<view class="item-right-text">
							{{val.is_online == 1 ? '在线' : '离线'}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="doButton"  v-show="!data.is_action && data.type == 1" >
			 <button class="group-button" type="button" @tap="liveGroup">离开群聊</button>
		 </view> -->

	</view>
</template>

<script>
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _get from '../../../common/_get';
	import _page from '../../../common/common';

	export default {
		data() {
			return {
				data: {
					member: [],
					group: {
						is_photo: 'default_group_photo/90.jpg',
					},
					is_action: 0,
					type: 1,
				},
				list_id: 0,
				user_id: 0
			};
		},
		computed: {
			staticPhoto() {
				return _data.staticPhoto();
			},
			isAction() {
				if (this.data.group.main_id == _data.data('user_info').id) {
					return true;
				}
				return false;
			},
			showKefu() {
				return this.my_data.id != 5880
			}
		},
		onShow() {
			_hook.routeSonHook();
			let _this = this;
			_this.$httpSend({
				path: '/im/message/getChatDetails',
				data: {
					list_id: _this.list_id,
				},
				success(data) {
					_this.data = data;
					if (data.type == 1) {
						uni.setNavigationBarTitle({
							title: `全部成员（${data.member.length}人）`,
						});
					}
					let cache_data = _data.data('cache');
					if (data.type == 1 && !('group_photo_' + _this.list_id in cache_data)) {
						uni.downloadFile({
							url: _data.staticPhoto() + data.group.is_photo,
							success: (res) => {
								if (res.statusCode === 200) {
									cache_data['group_photo_' + _this.list_id] = res.tempFilePath;
									_data.data('cache', cache_data);
								}
							}
						});
					}

				}
			});
		},
		methods: {
			goKefu() {
				this.$httpSend({
					path: '/im/get/kefu',
					success(data) {
						console.log('客服数据', data)
						uni.navigateTo({
							'url': '/pages/chat/message?list_id=' + data
						})
					}
				});
			},
			groupNickname(val) {
				console.log(val)
				uni.navigateTo({
					url: 'group_nickname?' + _page.pageParam({
						list_id: this.list_id,
						nickname: val
					})
				})
			},
			disturb(e) {
				//消息免打扰
				let value = e.detail.value ? 1 : 0;
				let _this = this;
				this.$httpSend({
					path: '/im/message/msgDisturb',
					data: {
						list_id: this.list_id,
						value: value
					},
					success(data) {
						_data.localData('DISTURB:' + _this.list_id, value)
					}
				});
			},
			liveGroup() {
				//离开群聊
				let _this = this;
				uni.showModal({
					title: '重要提示',
					content: '确定要离开群聊吗?',
					confirmText: '离开',
					cancelText: '再看看',
					confirmColor: 'red',
					cancelColor: '#353535',
					success: function(res) {
						if (res.confirm) {
							_this.$httpSend({
								path: '/im/message/liveGroup',
								data: {
									list_id: _this.list_id
								},
								success(data) {
									console.log(data)
									uni.switchTab({
										url: '../index'
									});
								}
							});
						}
					}
				});
			},
			imageError(e) {
				console.log("图片加载失败!", e.detail);
				let index = e.currentTarget.dataset.index
				console.log(e.currentTarget.dataset.index)
				//替换index对应的图片
				console.log(this.data.member[index].photo)
				this.data.member[index].photo = '/default_photo_path.png';
			},
			removeGroup() {
				let _this = this;
				uni.showModal({
					title: '重要提示',
					content: '此操作数据不可恢复,确定要解散该群吗?',
					confirmText: '不解散',
					cancelText: '解散',
					confirmColor: '#353535',
					cancelColor: 'red',
					success: function(res) {
						if (!res.confirm) {
							_this.$httpSend({
								path: '/im/message/removeGroup',
								data: {
									list_id: _this.list_id,
								},
								success(data) {
									uni.switchTab({
										url: '../index'
									});
								}
							});
						}
					}
				});
			},
			photo(path) {
				return this.staticPhoto + path + '?_=' + Math.random();
			},
			msgChange(e) {
				let value = e.detail.value ? 1 : 0;
				if (this.data.is_action != 2) {
					uni.showModal({
						content: '没有权限设置',
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/groupIsMsg',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			nimingChange(e) {
				let value = e.detail.value ? 1 : 0;
				if (!this.data.is_action && this.data.is_action != 2) {
					uni.showModal({
						content: '没有权限设置',
						showCancel: false,
					});
					return;
				}
				this.$httpSend({
					path: '/im/message/nimingChange',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			msgTop(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/chatTop',
					data: {
						list_id: this.list_id,
						value,
					},
					success(data) {
						/** 更新对话列表数据 */
						for (let i = 0, local_chat_list = _data.localData('chat_list'), j = local_chat_list
								.length; i < j; i++) {
							if (local_chat_list[i].list_id == _this.list_id) {
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i, 1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list', local_chat_list);
								uni.$emit('data_chat_list', local_chat_list);
								break;
							}
						}

						return;
						uni.showToast({
							title: '设置成功',
							duration: 1500
						});
					}
				});
			},
			switch1Change(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/message/speekChecked',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {
						/** 更新对话列表数据 */
						for (let i = 0, local_chat_list = _data.localData('chat_list'), j = local_chat_list
								.length; i < j; i++) {
							if (local_chat_list[i].list_id == _this.list_id) {
								let action_list_data = local_chat_list[i];
								local_chat_list.splice(i, 1);
								local_chat_list.unshift(action_list_data);
								_data.localData('chat_list', local_chat_list);
								uni.$emit('data_chat_list', local_chat_list);
								break;
							}
						}
					}
				});
			},
			editChange(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/vendor/editChange',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {

					}
				});
			},
			goGroupQrcode() {
				uni.navigateTo({
					url: ('./group_qrcode?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetGroupPhoto() {
				if (this.data.is_action != 2 && !this.data.group.edit_photo) {
					uni.showToast({
						title: '没有权限设置',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/group_photo?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			goSetAdmin(type) {
				switch (type) {
					case 1:
						if (this.data.is_action != 2) {
							console.log("this.data.is_action", this.data.is_action)
							uni.showToast({
								title: '群主才能设置',
								icon: 'none',
								duration: 1000
							});
							return;
						}
						break;
					case 2:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: '没有权限设置',
								showCancel: false,
							});
							return;
						}
						break;
					case 3:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: '没有权限设置',
								showCancel: false,
							});
							return;
						}
						break;
					case 4:
						if (this.data.is_action != 2) {
							uni.showModal({
								content: '没有权限设置',
								showCancel: false,
							});
							return;
						}
						break;
					default:
						return;
						break;
				}
				let url = '../../set/group_admin?list_id=' + this.list_id + '&type=' + type;
				if (type == 3) url = '../../set/group_trans?list_id=' + this.list_id + '&type=' + type;
				if (type == 4) url = '../../set/copy_group?list_id=' + this.list_id + '&type=' + type;
				uni.navigateTo({
					url: url,
					animationType: 'slide-in-bottom',
				});
			},
			goSet(type) {
				if (this.data.is_action != 2 && !this.data.group.edit_photo) {
					uni.showToast({
						title: '没有权限设置',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../set/message_more?list_id=' + this.list_id + '&type=' + type),
					animationType: 'slide-in-bottom',
				});
			},
			goDetails(user_id) {
				if (this.data.type && this.data.is_action != 2) {
					uni.showToast({
						title: '没有权限查看',
						icon: 'none',
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: ('../../details/index?user_id=' + user_id + '&type=' + this.data.type + '&list_id=' + this
						.list_id + "&is_action=" + this.data.is_action),
				});
			},
			add() {
				uni.navigateTo({
					url: ('../../friend/index_list?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			reduce() {
				uni.navigateTo({
					url: ('./reduce?list_id=' + this.list_id),
					animationType: 'slide-in-bottom',
				});
			},
			groupCopy(value) {
				_page.uniCopy({
					content: this.data.group.id,
					success: function() {
						uni.showToast({
							'title': '复制成功',
							duration: 2000
						})
					}
				})
			},
			replaceStr(str) {
				console.log(str)
				return str.substr(10)
			},
			getRedChange(e) {
				let _this = this,
					value = e.detail.value ? 1 : 0;
				this.$httpSend({
					path: '/im/vendor/getRedChange',
					data: {
						list_id: this.list_id,
						value: value,
					},
					success(data) {

					}
				});
			},
			goBigRedList() { //todo 长时间未领取红包列表
				uni.navigateTo({
					url: "../message/red_list?list_id=" + this.list_id
				})
			},
			manarger() {
				uni.navigateTo({
					url: '../message/qun_manage?list_id=' + this.list_id
				})
			},
			xiaoHui() { //销毁聊天记录
				_get.xiaoHui({
					type: this.data.type,
					list_id: this.list_id
				}, function() {

				})
			}
		},
		onLoad(option) {
			this.list_id = option.list_id;
			this.data.type = option.type;
		},
	}
</script>

<style scoped>
	.item-text {
		display: flex;
		align-items: center;
	}

	.item-right-text {
		color: #80c8a8;
	}

	.tag-admin {
		border: 1px solid #80c8a8;
		margin-left: 20rpx;
		color: #80c8a8;
		height: 30rpx;
		font-size: 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 15rpx;
		padding: 0 10rpx;
	}

	.group-member-btn-box {
		display: flex;
		flex-direction: column;
		align-items: center;

		.tip {
			font-size: 30rpx;
			color: #333;
		}
	}

	.group-member-btn {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #efefef;
		margin: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40rpx;
		color: #b6b6b8;
		font-weight: bold;
	}

	page {
		background: #fff;
	}

	.my-padding {
		padding-right: 0 !important;
	}

	.page {
		max-width: 100%;
	}

	.photos {
		background-color: #FFFFFF;

	}

	.group-button {
		width: 92%;
		background-color: #5693ee;
		color: white;
		height: 70upx;
		line-height: 70upx !important;
		border-radius: 40upx;
		font-size: 36upx;
		cursor: pointer;
		margin-top: 20upx;
	}

	.photo_main {
		margin: 7upx 0 0 40upx;
		display: inline-block;
		text-align: center;
	}

	.qun-gonggao {
		display: flex;
		justify-content: space-between;
		width: 95%;
	}

	.photo {
		width: 106upx;
		height: 106upx;
		border-radius: 7upx;
	}

	.name_class {
		font-size: 12px;
		color: black;
		max-width: 106upx;
		overflow: hidden;
		white-space: nowrap;
	}

	.msg-size {
		font-size: 16px !important;
	}

	.title {
		background: #FFFFFF;
		padding: 10px 20px 10px 23px;
		border-top: 1px solid #e5e5e5;
		display: flex;
		justify-content: space-between;
	}

	.title-msg {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		color: black !important;
		font-size: 16px !important;
	}

	.title-img {
		display: flex;
		align-items: center;
	}

	.title_val {
		display: inline-block;
	}

	.switch_class {
		margin-top: 20upx;
	}


	.show_text {
		position: absolute;
		right: 30px;
		color: #8f8f94;
		display: inline-block;
		/* width: 320px; */
		overflow: hidden;
		height: 30px;
	}

	.photo_qrcode {
		width: 52upx;
		height: 52upx;
		margin-right: 0upx;
	}

	.uni-list-cell-navigate.uni-navigate-right:after {
		font-size: 20px !important;
	}

	.uni-list-cell {
		height: 60px !important
	}

	.uni-list-cell-pd {
		padding: 0px 10px 0 12px !important;
	}

	.uni-media-list-logo {
		margin-right: 0px !important;
	}

	.qun-id {
		display: flex;
		justify-content: center;
		align-items: center;
		word-break: break-all;
	}

	.item-left-img {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 10px 0 25px;
	}

	.item-right-img {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30px;
	}

	.item-right-img image {
		width: 20px;
		height: 20px;
	}

	.item-left-img image {
		width: 45px;
		height: 45px;
		border-radius: 50%;
	}

	.member-list {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;

	}

	.member-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-top: 1px solid #ebebeb;
	}

	.item-left {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.item-right {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 30px 0 20px;
		color: #435d90;
	}

	.yaoqing-menber {
		display: flex;
		align-items: center;
		padding: 10px 0 10px 30px;
		background-color: #ffffff;
	}

	.yaoqing {
		margin-left: 5px;
	}

	.list-member-count {
		padding: 5px 0 5px 30px;
		background-color: #f0eff4;
	}

	.doButton {
		padding: 10px;
	}
</style>
