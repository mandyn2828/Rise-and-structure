import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Plus, Send, User, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      fetchPostDetails(selectedPostId);
    }
  }, [selectedPostId]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/community/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/community/posts/${id}`);
      setSelectedPost(res.data);
    } catch (err) {
      console.error('Failed to fetch post details');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/community/posts', newPost);
      setNewPost({ title: '', content: '' });
      setShowCreateModal(false);
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/community/posts/${selectedPostId}/comments`, { content: comment });
      setComment('');
      fetchPostDetails(selectedPostId);
      fetchPosts(); // Update comment count in list
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl font-body text-text-secondary">Connecting to community...</div>;

  return (
    <div className="max-w-4xl mx-auto font-body">
      {selectedPostId ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-300">
          <button 
            onClick={() => { setSelectedPostId(null); setSelectedPost(null); }}
            className="flex items-center gap-2 text-text-secondary hover:text-primary font-bold transition-colors mb-4"
          >
            <ArrowLeft size={20} /> Back to Community
          </button>

          {selectedPost && (
            <>
              <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-bg-soft rounded-full flex items-center justify-center text-primary font-bold">
                    {selectedPost.author_name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-text-primary">{selectedPost.author_name}</div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={12} /> {new Date(selectedPost.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-heading text-primary mb-6">{selectedPost.title}</h1>
                <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-heading text-primary flex items-center gap-2">
                  <MessageSquare size={20} /> Replies ({selectedPost.comments?.length || 0})
                </h2>
                
                <div className="space-y-4">
                  {selectedPost.comments?.map((c) => (
                    <div key={c.id} className="bg-bg-main/50 rounded-2xl p-6 border border-border/50 ml-8">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                          {c.author_name[0]}
                        </div>
                        <span className="font-bold text-sm text-text-primary">{c.author_name}</span>
                        <span className="text-[10px] text-text-muted">• {new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-text-secondary leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="bg-white rounded-2xl border border-border p-4 shadow-md">
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your thoughts..."
                    className="w-full bg-bg-main/30 border-none focus:ring-0 rounded-xl p-4 text-text-primary min-h-[100px]"
                    required
                  ></textarea>
                  <div className="flex justify-end mt-4">
                    <button 
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-hover transition-all"
                    >
                      <Send size={18} /> Reply
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-heading text-primary mb-2">Community Board</h1>
              <p className="text-text-secondary text-lg">Share your progress, ask questions, and rise together.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={20} /> New Post
            </button>
          </header>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPostId(post.id)}
                className="bg-white rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-bg-soft rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                      {post.author_name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors">{post.title}</div>
                      <div className="text-[10px] text-text-muted flex items-center gap-1 uppercase tracking-widest font-black">
                        {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-muted bg-bg-main px-3 py-1 rounded-full text-xs font-bold">
                    <MessageSquare size={14} /> {post.comment_count}
                  </div>
                </div>
                <p className="text-text-secondary line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="py-20 text-center bg-bg-soft/30 rounded-[2rem] border-2 border-dashed border-border">
                <MessageSquare size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
                <p className="text-text-secondary text-lg font-medium">No posts yet. Be the first to start the conversation!</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-xl p-8 md:p-10 animate-in zoom-in duration-300">
            <h2 className="text-3xl font-heading text-primary mb-8">Create a Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-1">Title</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-bg-main rounded-xl border-border focus:ring-primary focus:border-primary p-4 font-bold"
                  placeholder="What's on your mind?"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-text-muted mb-2 ml-1">Content</label>
                <textarea 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full bg-bg-main rounded-xl border-border focus:ring-primary focus:border-primary p-4 min-h-[200px]"
                  placeholder="Share your thoughts or questions with the community..."
                  required
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold text-text-secondary hover:bg-bg-soft transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
