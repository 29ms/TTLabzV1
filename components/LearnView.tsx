
import React, { useEffect, useState } from 'react';
import { rssService } from '../services/rssService';
import { BlogPost } from '../types';

const LearnView: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await rssService.fetchMediumPosts();
        setPosts(data);
      } catch (error) {
        console.error("Knowledge base link error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto animate-in fade-in duration-700">
      <header className="mb-20 border-b border-zinc-900 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Global_Knowledge_Base</span>
        </div>
        <h1 className="text-5xl font-light mb-8 tracking-tight uppercase text-zinc-200">Learn_Tech</h1>
        <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm font-light uppercase">
          Deconstructing complex digital systems into foundational concepts. Automated synchronization with 
          <span className="text-zinc-300"> TechTales Intelligence Reports</span>.
        </p>
      </header>

      {loading ? (
        <div className="space-y-12 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-zinc-900/20 border border-zinc-900/50"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-20">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="flex flex-col md:flex-row gap-12 items-start pb-16 border-b border-zinc-900/50 last:border-0 group cursor-pointer"
              onClick={() => window.open(post.url, '_blank')}
            >
              <div className="flex-1 space-y-5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{post.category}</span>
                  <span className="text-[10px] font-mono text-zinc-700 tracking-tight">{post.pubDate}</span>
                </div>
                
                <h3 className="text-2xl font-light tracking-tight text-zinc-200 group-hover:text-white transition-colors leading-tight uppercase">
                  {post.title}
                </h3>
                
                <p className="text-zinc-500 text-[13px] leading-relaxed font-light line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                    <span className="group-hover:text-zinc-500 transition-colors">{post.readTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Read Full Intel →</span>
                  </div>
                </div>
              </div>
              
              {/* Technical Source Box */}
              <div className="w-full md:w-[240px] h-[140px] shrink-0 overflow-hidden bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center p-6 group-hover:bg-zinc-900 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-1 h-1 bg-zinc-800" />
                <div className="absolute bottom-0 right-0 w-1 h-1 bg-zinc-800" />
                
                <span className="text-[9px] font-mono text-zinc-700 uppercase mb-2 tracking-widest">Source_Node</span>
                <span className="text-[10px] font-mono text-zinc-600 tracking-tight text-center uppercase">MEDIUM.COM/@REALTECHTALES</span>
                <div className="mt-4 w-4 h-[1px] bg-zinc-800 group-hover:w-12 group-hover:bg-zinc-400 transition-all duration-700"></div>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="mt-32 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
          INTELLIGENCE IS THE SOURCE CODE OF SOVEREIGNTY.
        </p>
        <div className="flex gap-8">
          <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">SECURE_FEED: 256_BIT</span>
        </div>
      </footer>
    </div>
  );
};

export default LearnView;
