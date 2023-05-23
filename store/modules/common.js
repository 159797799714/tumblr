export default {
	state: {
		KeyboardHeight: 0,
		moveX: 0,
		moveY: 0,
		custom_font_size: 14,
	},
	mutations: {
		changeKeyboardHeight(state, h) {
			state.KeyboardHeight = h
		},
		setMoveX(x) {
			this.moveX = x;
		},
		setMoveY(y) {
			this.moveY = y;
		},
		setFontSize(state, val) {
			state.custom_font_size = val;
			try {
				uni.setStorageSync('custom_font_size', val);
			} catch (e) {
				// error
			}
		},
	},
	getters: {
		getFontSize(state) {
			let size = ''
			try {
				size = uni.getStorageSync('custom_font_size');
				console.log("当前字体大小", size)
				if (size) {
					return size;
				} else {
					return state.custom_font_size;
				}
			} catch (e) {
				// error
				if (size) {
					return size;
				} else {
					return state.custom_font_size;
				}
			}
		}
	}
}
