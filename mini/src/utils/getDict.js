import request from '@/utils/request'

import {
	list2
} from '@/api/dict.js'

const getDict = function getDict(type,code) {
	return new Promise((resolve, reject) => {
		list2({
				paterCode: type,
				code:code
			})
			.then(res => {
				resolve(res.data)
			}).catch(error => {
				reject(error)
			})
	})
}
export default getDict
