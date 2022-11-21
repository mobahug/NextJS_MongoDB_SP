import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNodeArray,
  ReactPortal,
  ReactChild,
  ReactFragment,
  ReactNode,
  Key,
} from "react";

export async function getServerSideProps(_context: any) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_airbnb");

    const data = await db
      .collection("listingsAndReviews")
      .find({})
      .sort({ metacritic: -1 })
      .limit(20)
      .toArray();

    const properties = JSON.parse(JSON.stringify(data));

    const filtered = properties.map((property: any) => {
      const price = JSON.parse(JSON.stringify(property.price));
      return {
        _id: property._id,
        name: property.name,
        image: property.images.picture_url || null,
        address: property.address,
        summary: property.summary,
        guests: property.accommodates,
        price: price.$numberDecimal,
      };
    });

    return {
      props: { properties: filtered, isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({
  isConnected,
  properties,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(properties);

  const book = async (property: {
    image?: string | undefined;
    name?:
      | string
      | number
      | boolean
      | {}
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactNodeArray
      | ReactPortal
      | null
      | undefined;
    guests?:
      | string
      | number
      | boolean
      | {}
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactNodeArray
      | ReactPortal
      | null
      | undefined;
    address?: {
      street:
        | boolean
        | ReactPortal
        | ReactChild
        | ReactFragment
        | null
        | undefined;
    };
    summary?:
      | boolean
      | ReactPortal
      | ReactChild
      | ReactFragment
      | null
      | undefined;
    price?:
      | string
      | number
      | boolean
      | {}
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactNodeArray
      | ReactPortal
      | null
      | undefined;
    _id?: any;
  }) => {
    const data = await fetch(
      `http://localhost:3000/api/book?property=${property._id}&guest=Ado`
    );
    const res = await data.json();
    console.log(res);
  };

  return (
    <div>
      <Head>
        <title>Nextbnb</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
        />
      </Head>
      <div className="container mx-auto">
        <div className="flex">
          <div className="row w-full text-center my-4">
            <h1 className="text-4xl font-bold">Nextbnb</h1>
          </div>
        </div>

        <div className="flex flex-row flex-wrap">
          {properties &&
            properties.map(
              (property: {
                _id: Key | undefined;
                image: string | undefined;
                name:
                  | string
                  | number
                  | boolean
                  | {}
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | ReactNodeArray
                  | ReactPortal
                  | null
                  | undefined;
                guests:
                  | string
                  | number
                  | boolean
                  | {}
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | ReactNodeArray
                  | ReactPortal
                  | null
                  | undefined;
                address: {
                  street:
                    | boolean
                    | ReactChild
                    | ReactFragment
                    | ReactPortal
                    | null
                    | undefined;
                };
                summary:
                  | boolean
                  | ReactChild
                  | ReactFragment
                  | ReactPortal
                  | null
                  | undefined;
                price:
                  | string
                  | number
                  | boolean
                  | {}
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | ReactNodeArray
                  | ReactPortal
                  | null
                  | undefined;
              }) => (
                <div
                  key={property._id}
                  className="flex-auto w1/4 rounded overflow-hidden shadow-lg m-2"
                >
                  <img className="w-full" src={property.image} alt="image" />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">
                      {property.name} (Up to {property.guests} guests)
                    </div>
                    <p>{property.address.street}</p>
                    <p className="text-gray-700 text-base">
                      {property.summary}
                    </p>
                  </div>

                  <div className="text-center py-2 my-2 font-bold">
                    <span className="text-green-500">${property.price}</span>
                    /night
                  </div>

                  <div className="text-center py-2 my-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => book(property)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              )
            )}
          ;
        </div>
      </div>
    </div>
  );
}
