const db = uniCloud.database();
const dbCmd = db.command
const depositTable = db.collection('wallpaper-list')
exports.main = async (event, context) => {
	console.log(event, 5456);
	let {
		skipNumber,
		pageSize
	} = event
	let res = await db.collection('wallpaper-list')
		.skip(skipNumber)
		.limit(pageSize)
		.orderBy("dateTimestamp", "desc")
		.get();
	return res
};