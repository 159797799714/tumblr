<template>
	<view class="page">
		<view class="bode_main">
			<view class="uni-list my_padding">
					<view class="uni-list-cell">
						<view class="uni-media-list uni-list-cell-navigate">
							<view class="uni-media-list-logo photo">
								<image :src="myPhoto" :lazy-load="true"/>
							</view>
							<view class="uni-media-list-body" style="height: 50px;">
								<view class="uni-media-list-text-top" @click="copyInviteUrl()">邀请码：{{my_data.invite_code}}</view>
								<view class="uni-media-list-text-bottom uni-ellipsis" @click="copyInviteUrl()">点击复制邀请链接</view>
							</view>
						</view>
					</view>
			</view>
			<!--:icon="qrPhoto"-->
			<view class="qrimg">
				<tki-qrcode
				ref="qrcode"
				:val="invite_url"
				:onval="true"
				:size="500"
				unit="upx"
				background="#ffffff"
				foreground="#000000"
				pdground="#000000"
				:loadMake="true"
				:showLoading="true"
				loadingText="加载中..."
				@result="qrR" />
				<text class="text_font">扫一扫上面的二维码,邀请好友注册</text>
				<view>
					<text @click="goPath('./my_invite')">查看我的推广</text>
					<text @click="goPath('./wallet/capital_invite')" style="margin-left: 50px;">查看推广收益</text>
				</view>
				
			</view>
		
		</view>
	</view>
</template>

<script>
	
	import uniList from '../../components/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue';
	import _page from '../../common/common';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import tkiQrcode from "../../components/tki-qrcode/tki-qrcode";
	import uniCopy from '../../js_sdk/xb-copy/uni-copy.js'
	
	export default {
		components: {
			uniList,
			uniListItem,
			tkiQrcode,
		},
		data() {
			return {
				my_data: { id: 0 },
				img_path: '',
				invite_url: ''
			}
		},
		onShow(){
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info',function(data){
				_this.my_data = data;
			});
			_this.my_data = _data.data('user_info');
			
			_this.invite_url = '../pages/in/reg?invite_code='+_this.my_data.invite_code
		},
		onLoad() {
			
		},
		onUnload(){
			uni.$off('data_user_info');
		},
		computed: {
			copyInviteUrl(){
				let _this = this
				_page.uniCopy({
					content: _this.invite_url,
					success:function () {
						uni.showToast({'title':'复制成功',duration:2000})
					}
				})
				
				/* uniCopy({
					content: _this.invite_url,
					success:(res)=>{
						uni.showToast({
							title: res,
							icon: 'none'
						})
					},
					error:(e)=>{
						uni.showToast({
							title: e,
							icon: 'none',
							duration:3000,
						})
					}
				}) */
			},
			qrPhoto(){
				return _data.data('cache').local_photo;
			},
			myPhoto(){
				return _data.staticPhoto() + this.my_data.photo;
			},
		},
		methods: {
			qrR(ref){
				this.img_path = ref;
			},
			goPath(url){
				uni.navigateTo({
				    url: url,
				});
			}
		},
		watch: {
			
		},
	}
</script>

<style scoped>
	
	.qrimg {
		text-align: center;
		background: #FFFFFF;
		padding-bottom: 40upx;
	}
	
	.bode_main {
		margin: 150upx 35upx 0 35upx;
		width: 680upx;
		height: 800upx;
		border-radius: 50upx;
	}
	
	.photo {
		width: 110upx;
		height: 110upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}
	
	.my_padding {
		padding-bottom: 20px;
	}
	
	.my_padding:before {
		background-color:white;
	}
	
	.my_padding:before {
		background-color:white;
	}	
	
	.my_padding:after {
		background-color:white;
	}
	
	.text_font {
		color: #8f8f94;
	}
	
</style>