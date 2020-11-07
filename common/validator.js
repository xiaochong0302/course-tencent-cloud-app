export const phone = (str) => {
	return /^1(3|4|5|6|7|8|9)[0-9]{9}$/.test(str)
}

export const email = (str) => {
	return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(str)
}

export const password = (str) => {
	return /^[0-9a-zA-Z~!@#$%^&*]{6,16}$/.test(str)
}

export const userName = (str) => {
	return /^[0-9a-zA-Z\u4E00-\u9FA5]{2,15}$/.test(str)
}

export const verifyCode = (str) => {
	return /^[0-9]{6}$/.test(str)
} 