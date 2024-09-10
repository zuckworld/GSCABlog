import { GraphQLClient, gql } from "graphql-request";

const graphqlAPI =
  "https://eu-west-2.cdn.hygraph.com/content/cm0e0ae6m00hw07w7582pvwgd/master";

/** *************************************************************
 * Any file inside the folder pages/api is mapped to /api/* and  *
 * will be treated as an API endpoint instead of a page.         *
 *************************************************************** */

// export a default function for API route to work
export default async function asynchandler(req, res) {
  try {
    const graphQLClient = new GraphQLClient(graphqlAPI, {
      headers: {
        authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
      },
    });
    console.log("Authorization Token: ", process.env.GRAPHCMS_TOKEN);

    const query = gql`
      mutation CreateComment(
        $name: String!
        $email: String!
        $comment: String!
        $slug: String!
      ) {
        createComment(
          data: {
            name: $name
            email: $email
            comment: $comment
            post: { connect: { slug: $slug } }
          }
        ) {
          id
        }
      }
    `;

    const result = await graphQLClient.request(query, {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      slug: req.body.slug,
    });
    console.log("Request Body: ", req.body);

    return res.status(200).send(result);
  } catch (error) {
    console.error("GraphQL Error: ", error.response || error.message);
    return res.status(500).json({
      error: "Error submitting comment",
      details: error.response ? error.response.errors : error.message,
    });
  }
}
