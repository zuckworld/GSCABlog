import React from "react";
import { useRouter } from "next/router";

import { getPosts, getPostDetails } from "../../services";
import {
  PostDetail,
  Categories,
  PostWidget,
  Author,
  Comments,
  CommentsForm,
  Loader,
} from "../../components";

const PostDetails = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <div className="container mx-auto px-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            <PostDetail post={post} />
            <Author author={post.author} />
            {/* <AdjacentPosts slug={post.slug} createdAt={post.createdAt} /> */}
            <CommentsForm slug={post.slug} />
            <Comments slug={post.slug} />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
              <PostWidget
                slug={post.slug}
                categories={
                  post.categories?.map((category) => category.slug) || []
                }
              />
              <Categories />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default PostDetails;

// Fetch data at build time
export async function getStaticProps({ params }) {
  try {
    const post = await getPostDetails(params.slug);

    // Log post details for debugging
    console.log("Post details:", post);

    if (!post) {
      return {
        notFound: true, // Return 404 if post is not found
      };
    }

    return {
      props: { post },
      revalidate: 10, // Optionally set revalidation time
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticPaths() {
  try {
    const posts = await getPosts();

    // Ensure the correct slug field is used here
    const paths = posts.map((post) => ({
      params: { slug: post.slug }, // Assuming getPosts returns post object with slug field
    }));

    return {
      paths,
      fallback: "blocking", // Changed to 'blocking' for better UX
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: false, // Disable fallback if something goes wrong
    };
  }
}
