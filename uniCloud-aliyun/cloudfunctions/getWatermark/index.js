const db = uniCloud.database();
const dbCmd = db.command
const depositTable = db.collection('watermark')
exports.main = async (event, context) => {
	let userId = event.user_id
	let res = await db.collection('watermark').where({
		user_id: dbCmd.eq(userId)
	}).get()
	return res
};