"use strict"

import * as Api from '@/common/api.js'

/**
 * 加载验证码JS文件
 */
function loadScript(url) {
	return new Promise((resolve, reject) => {
		if (window.TencentCaptcha === undefined) {
			let script = document.createElement("script")
			let head = document.getElementsByTagName("head")[0]
			script.type = "text/javascript"
			script.charset = "UTF-8"
			script.src = url
			head.appendChild(script)
			script.onload = function() {
				resolve()
			};
			script.onerror = function() {
				reject(new Error("验证码脚本加载失败，请重试"))
			};
		} else {
			resolve()
		}
	});
}

/**
 * 验证码creater
 * @param {function} callback 回调函数, 回调结果请参见 https://cloud.tencent.com/document/product/1110/36841
 * @param {object} options 更多配置参数, 请参见 https://cloud.tencent.com/document/product/1110/36841#pzcs
 * @returns {Promise<object>} 返回TencentCaptcha的实例提供一些操作验证码的方法
 */
async function captchaCreater(callback, options) {
	try {
		await loadScript("https://ssl.captcha.qq.com/TCaptcha.js");
		const appId = await Api.getCaptchaInfo().then(res => {
			return res.captcha.app_id
		})
		return new TencentCaptcha(appId, callback, options)
	} catch (error) {
		throw new Error(error)
	}
}

export {
	captchaCreater
}
