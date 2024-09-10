import Head from "next/head";
import { PostCard, Categories, PostWidget } from "../components";
// Import getPosts from your services
import { getPosts } from "../services";
import { FeaturedPosts } from "../sections";

export default function Home({ posts }) {
  // Ensure `posts` is an array
  if (!Array.isArray(posts)) {
    return <div>No posts available</div>;
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>GSCA Blog</title>
        <link rel="icon" href="../favicon.png" />
      </Head>
      <FeaturedPosts />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {posts.map((post) => (
            <PostCard post={post} key={post.title} />
          ))}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget />
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetch data at build time
export async function getStaticProps() {
  const posts = (await getPosts()) || [];
  return {
    props: { posts },
  };
}
