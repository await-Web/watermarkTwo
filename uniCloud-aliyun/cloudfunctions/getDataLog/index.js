const db = uniCloud.database();
const dbCmd = db.command
const analysisTable = db.collection('analysis-dataLog')
exports.main = async (event, context) => {
	let {
		type
	} = event
	let {
		user_id,
		skipNumber,
		pageSize
	} = event
	let res = await db.collection('analysis-dataLog').where({
			user_id: type === 'current' ? dbCmd.eq(user_id) : dbCmd.neq(user_id)
		})
		.skip(skipNumber)
		.limit(pageSize)
		.orderBy("dateTimestamp", "desc")
		.get()
	return res
};