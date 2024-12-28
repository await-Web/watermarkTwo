const db = uniCloud.database();
const depositTable = db.collection('deposit-sign-in')
exports.main = async (event, context) => {

	let res = await db.collection('deposit-sign-in').where({
		`user_id == "${event.user_id}"`
	}).get()

	return res
};