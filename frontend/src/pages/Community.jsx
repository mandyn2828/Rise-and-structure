import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Heart, Share2, Send, Plus, User as UserIcon, MessageCircle } from 'lucide-react';
import { API_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/community/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;
    setIsPosting(true);
    try {
      await axios.post(`${API_URL}/community/posts`, {
        title: newPostTitle,
        content: newPostContent
      });
      setNewPostTitle('');
      setNewPostContent('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReact = async (postId, type) => {
    try {
      await axios.post(`${API_URL}/community/posts/${postId}/react`, { type });
      fetchPosts();
    } catch (err) {
      console.error('Failed to react');
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${API_URL}/community/posts/${postId}/comments`);
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch comments');
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
    } else {
      setActiveCommentsPostId(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment) return;
    try {
      await axios.post(`${API_URL}/community/posts/${postId}/comments`, {
        content: newComment
      });
      setNewComment('');
      fetchComments(postId);
      fetchPosts(); // To update comment count
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-body text-text-secondary text-xl">Connecting to the tribe...</div>;

  return (
    <div className="max-w-4xl mx-auto font-body">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading text-primary mb-2">Community</h1>
          <p className="text-text-secondary text-lg">Connect, share milestones, and support the rebuild.</p>
        </div>
        <div className="bg-bg-soft px-4 py-2 rounded-2xl flex items-center gap-2 text-primary font-bold text-sm">
           <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
           142 Members Online
        </div>
      </header>

      {/* Create Post */}
      <section className="bg-white rounded-[2.5rem] border border-border shadow-sm p-8 mb-12">
        <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
          <Plus size={20} className="text-primary" />
          Share an Update
        </h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <input 
            type="text" 
            placeholder="Post Title (e.g., Day 7 Progress, Financial Win!)"
            className="w-full bg-bg-soft border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <textarea 
            placeholder="What's on your mind?"
            className="w-full bg-bg-soft border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isPosting || !newPostTitle || !newPostContent}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              Post to Community
            </button>
          </div>
        </form>
      </section>

      {/* Feed */}
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center overflow-hidden">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-text-primary leading-none mb-1">{post.full_name}</p>
                  <p className="text-xs text-text-muted">{new Date(post.created_at).toLocaleDateString()} • Tribe Member</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">{post.title}</h3>
              <div className="prose prose-primary max-w-none text-text-secondary leading-relaxed mb-8">
                {post.content}
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-border">
                <button 
                  onClick={() => handleReact(post.id, 'like')}
                  className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-secondary transition-colors"
                >
                  <Heart size={20} className={post.reaction_count > 0 ? 'fill-secondary text-secondary' : ''} />
                  <span>{post.reaction_count || 0}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary transition-colors"
                >
                  <MessageSquare size={20} />
                  <span>{post.comment_count || 0} Comments</span>
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-primary ml-auto">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {activeCommentsPostId === post.id && (
              <div className="bg-bg-soft/50 border-t border-border p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-6 mb-8">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-8 h-8 bg-white border border-border text-primary rounded-xl flex-shrink-0 flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-2xl border border-border shadow-sm">
                        <p className="text-sm font-bold text-text-primary mb-1">{comment.full_name}</p>
                        <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {(!comments[post.id] || comments[post.id].length === 0) && (
                    <p className="text-center text-text-muted italic py-4">No comments yet. Be the first!</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Write a comment..."
                    className="flex-1 bg-white border border-border rounded-xl px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary-hover transition-all"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}

        {posts.length === 0 && (
          <div className="bg-bg-soft rounded-[3rem] p-20 text-center border-2 border-dashed border-border">
            <MessageCircle size={48} className="mx-auto text-text-muted mb-6" />
            <h3 className="text-2xl font-heading text-text-primary mb-2">The quiet before the storm</h3>
            <p className="text-text-secondary">Be the leader. Start the first conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
