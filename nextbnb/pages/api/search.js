import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const data = db.collection("listingsAndReviews").aggregate([
      {
        $search: {
          search: {
            query: req.query.term,
            path: ["description", "amenities"],
          },
        },
      },
      {
        $project: {
          description: 1,
          amenities: 1,
        },
      },
      {
        $limit: 20,
      },
	]);


    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
