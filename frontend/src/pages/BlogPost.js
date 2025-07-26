import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/blog/posts/slug/${slug}`);
      const postData = response.data;
      setPost(postData);

      // Fetch related posts
      const relatedResponse = await axios.get(`${API}/blog/posts?limit=3`);
      const filtered = relatedResponse.data.filter(p => p.id !== postData.id);
      setRelatedPosts(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setError("Blog post not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
            Browse Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li>
              <Link to="/blog" className="text-gray-500 hover:text-gray-700">Blog</Link>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900">{post.title}</span></li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.featured_image_base64 && (
            <div className="h-64 md:h-96 bg-gray-200">
              <img 
                src={`data:image/jpeg;base64,${post.featured_image_base64}`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.category_name && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category_name}
                </span>
              )}
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 mb-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>By {post.author}</span>
              </div>
              <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span>5 min read</span>
            </div>

            {/* Excerpt */}
            <div className="text-xl text-gray-700 mb-8 border-l-4 border-green-600 pl-6">
              {post.excerpt}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return <br key={index} />;
                
                // Simple formatting: convert **text** to bold and *text* to italic
                let formattedParagraph = paragraph
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>');

                return (
                  <p 
                    key={index} 
                    className="mb-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formattedParagraph }}
                  />
                );
              })}
            </div>

            {/* Social Share */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article:</h3>
              <div className="flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm">
                  Share on Facebook
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition text-sm">
                  Share on Twitter
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition text-sm">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-40 bg-gray-200">
                    {relatedPost.featured_image_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${relatedPost.featured_image_base64}`}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-2xl">📖</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 transition">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {relatedPost.excerpt.substring(0, 100)}...
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(relatedPost.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 bg-green-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get More Farm Animal Care Tips
          </h2>
          <p className="text-green-100 mb-6">
            Subscribe to our newsletter for the latest guides and product recommendations.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg focus:ring-2 focus:ring-green-300 focus:outline-none"
            />
            <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-r-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;