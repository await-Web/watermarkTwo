const db = uniCloud.database();
const dbCmd = db.command
const depositTable = db.collection('deposit-sign-in')
exports.main = async (event, context) => {
	let {
		user_id,
		curDate
	} = event
	let res = await db.collection('deposit-sign-in').where({
		user_id: dbCmd.eq(user_id)
	}).get()
	return res
};