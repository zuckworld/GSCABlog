import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

// Initialize GraphQL Client only once
const graphQLClient = new GraphQLClient(
  "https://eu-west-2.cdn.hygraph.com/content/cm0e0ae6m00hw07w7582pvwgd/master"
);

export const getPosts = async () => {
  const query = gql`
    query MyQuery {
      postsConnection(orderBy: createdAt_DESC) {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            category {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query);

    // Log the result for debugging
    console.log("Posts result:", result);

    const posts =
      result?.postsConnection?.edges?.map((edge) => edge.node) || [];
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        title
        excerpt
        featuredImage {
          url
        }
        author {
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        content {
          raw
        }
        category {
          name
          slug
        }
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query, { slug });
    return result?.post || null; // Return the post directly
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
};

export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query);
    return result.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails {
      posts(orderBy: createdAt_ASC, last: 3) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query);
    return result.posts;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
};

export const getSimilarPosts = async (category, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  try {
    const result = await graphQLClient.request(query, { slug, category });
    return result.posts;
  } catch (error) {
    console.error("Error fetching similar posts:", error);
    return [];
  }
};

export const getCategoryPost = async (slug) => {
  console.log("Attempting to fetch posts for category slug:", slug);
  console.log("GraphQL Endpoint:", graphQLClient.endpoint);

  const query = gql`
    query GetAllPosts {
      posts {
        title
        slug
        categories {
          name
          slug
        }
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query);
    console.log("Query result:", JSON.stringify(result, null, 2)); // Log the entire result
    return result.data.posts; // Adjust based on the actual structure
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (error.response) {
      console.error("GraphQL response errors:", error.response.errors);
      console.error("GraphQL response data:", error.response.data);
    }
    return [];
  }
};

export const submitComment = async (obj) => {
  const result = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  return result.json();
};

export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query, { slug });
    return result.comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const getFeaturedPosts = async () => {
  const query = gql`
    query GetCategoryPost {
      posts(where: { featuredPost: true }) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }
  `;

  try {
    const result = await graphQLClient.request(query);
    return result.posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
};
