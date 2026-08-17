'use client';

import { getBlogBySlug } from '@/lib/api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const { slug } = useParams();

  const [data, setData] = useState({ post: null, category: null, relatedPosts: [] });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data: result } = await getBlogBySlug(slug);
        setData({ post: result.post, category: result.category, relatedPosts: result.relatedPosts });
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1>title: {data.post?.title}</h1>

      <p>slug: {slug}</p>

      {/* category */}
      <p>name: {data.category?.name}</p>

      {/* related posts */}
      {data.relatedPosts?.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
