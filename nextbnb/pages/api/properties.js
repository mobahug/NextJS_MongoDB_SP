import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		const client = await clientPromise;
		const db = client.db("sample_airbnb");

		const data = await db
			.collection("listingsAndReviews")
			.find({})
			.sort({ metacritic: -1 })
			.limit(20)
			.toArray();

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
	}
}
