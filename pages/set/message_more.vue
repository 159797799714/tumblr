<template>
    <view class="page">
		<view class="uni-textarea" v-if="type == 'name'">
			<textarea auto-height v-model="content" :maxlength="-1" placeholder="填写内容，1-600字" />
		</view>
		<view v-if="type != 'name'">
			<view class="uni-textarea">
				
				<uni-list :border="true" v-if="notices.length > 0">
					<uni-list-item :title="notice.content" v-for="notice of notices" 
					:show-badge="notice.is_top == 1" 
					badge-text="置顶"  
					:show-switch="false" 
					@click="startEdit(notice)"
					:switchChecked="notice.is_top == 1"
					@switchChange="(disabled) => switchChange(disabled, notice)" ></uni-list-item>
				</uni-list>
			</view>
			
			<div class="uni-textarea" style="margin-top: 20rpx;padding-bottom: 20rpx; padding-top: 20rpx;">
			<view class="active-area">
				<h3 style="padding: 0px 20rpx;">{{ editing ? '编辑公告': '新增公告' }}</h3>
				<textarea auto-height v-model="noticeContent" :maxlength="-1" placeholder="公告内容，1-600字" />
				<view class="is_top">
					<text v-if="editing" @click="cancelEdit()" class="cancel-text">取消修改</text>
					<text v-if="editing" @click="confirmDel()" class="del-text">删除</text>
					<checkbox-group @change="isTopChange" style="width: auto;">
						<label>
							<checkbox :checked="is_top" />置顶
						</label>
					</checkbox-group>
				</view>
			</view>
			</div>
		</view>
    </view>
</template>

<script>
	
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	
	export default {
		components:{
			
		},
		data() {
			return {
				editing: false,
				editNotice: null,
				is_top: 0,
				content: '',
				noticeContent: '',
				type: '',
				list_id: 0,
				notices: [], // 群公告列表
				show_type: {
					name: {
						title: '群名称',
					},
					notice: {
						title: '群公告',
					}
				}
			}
		},
		onShow(){
			_hook.routeSonHook();
		},
		onLoad(option){
			let _this = this;
			_this.type = option.type;
			_this.list_id = option.list_id;
			_this.initData();
			uni.setNavigationBarTitle({
				title: (_this.show_type[_this.type].title + '设置'),
			});
			_this.$httpSend({
				path: '/im/message/getGroupData',
				data: { list_id: this.list_id,type: _this.type, },
				success(data) {
					_this.content = data;
				}
			});
		},
		computed: {
			
		},
		methods:{
			cancelEdit() {
				this.editing = false;
				this.editNotice = null;
				this.noticeContent = null;
			},
			confirmDel() {
				let _this = this;
				let notice = _this.editNotice;
				uni.showModal({
					title: '确认删除?',
					success: function(res) {
						if (res.confirm) {
							_get.delGroupNotice({
								list_id: _this.list_id,
								id: notice.id,
							}, function(res) {
								_this.initData();
								uni.showToast({
									title: '操作成功',
									duration: 2000
								});
							});
						}
					}
				})
			},
			startEdit(editNotice) {
				this.editing = true;
				this.noticeContent = editNotice.content;
				this.editNotice = editNotice;
				this.is_top = editNotice.is_top == 1;
			},
			isTopChange(checked) {
				this.is_top = this.is_top == 0 ? 1: 0;
			},
			initData() {
				let _this = this;
				_get.getGroupNotices({list_id: this.list_id}, function(data) {
					if (data) {
						_this.notices = data;
					}
				});
			},
			switchChange(disabled, notice) {
				console.log('disabled:', notice);
			},
			send() {
				if (this.type == 'name') {
					this.send2();
					return;
				}
				let _this = this;
				// 编辑状态
				if (_this.editing) {
					_get.editGroupNotice({
						list_id: _this.list_id,
						content: _this.noticeContent,
						is_top: _this.is_top == true ? 1 : _this.is_top,
						id: _this.editNotice.id,
					}, function(res) {
						console.log('res:', res);
						_this.initData();
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
						
						//_get.getChatData();
						
					});
				} else {
					_get.addGroupNotice({
						list_id: _this.list_id,
						content: _this.noticeContent,
						is_top: _this.is_top,
					}, function(res) {
						_this.initData();
						//_get.getChatData();
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
					});
				}
			},
			send2(){
				let _this = this;
				_this.$httpSend({
					path: '/im/message/setGroupData',
					data: { content: _this.content,type: _this.type,list_id: _this.list_id, },
					success(data) {
						
						/** 如果是修改群名称，重新获得会话列表,和当前会话数据 */
						if(_this.type == 'name'){
							
							let chat_data = _data.localData(_this.list_id);
							chat_data.show_name = data.show_name;
							_data.localData(_this.list_id,chat_data);
							
							let chat_list = _data.localData('chat_list');
							for(let i = 0,j = chat_list.length;i < j;i ++){
								if(chat_list[i].list_id == _this.list_id){
									chat_list[i].show_name = _this.content;
									_data.localData('chat_list',chat_list);
									uni.$emit('data_chat_list',chat_list);
									break;
								}
							}
						}
						
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack();
						},2000);
					}
				});
			},
			radioChange(e){
				this.info[this.show_type[this.type].key] = e.target.value;
			},
		},
		onNavigationBarButtonTap(e) {
			this.send();
		},
		watch: {
			
		},
	}
</script>

<style>
    .page{
        margin-top: 15px;
        height: 300px;
        background-color: white;
    }
	.is_top {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 25rpx;
		margin-top: 50rpx;
	}
		
	.cancel-text {
		color: #6135e5;
		margin-right: 20rpx;
	}
	
	.del-text {
		color: #f00;
		margin-right: 20rpx;
	}
	
    page{
    }
</style>