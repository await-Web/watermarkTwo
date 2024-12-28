const db = uniCloud.database();
const dbCmd = db.command
const depositTable = db.collection('deposit-sign-in')
'use strict';
exports.main = async (event, context) => {
	let data = {
		money: event.money,
		info: '已存钱',
	}
	await db.collection('deposit-sign-in').doc(event.id).update({
		calendar_data: dbCmd.push(data)
	})
	return data
};