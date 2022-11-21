import clientPromise from "../../lib/mongodb";

//creating new table with collection("bookings")
//inserting into the new table data using insertOne

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = client.db("sample_airbnb");
		const data = req.query;
		const response = await db.collection("bookings").insertOne(data);
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
}
