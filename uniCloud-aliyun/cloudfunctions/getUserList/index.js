const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')
exports.main = async (event, context) => {
	let res = await db.collection('uni-id-users').limit(1000).get()
	return res
};