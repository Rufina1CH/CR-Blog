import React, { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import Textarea from '../components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [formData, setFormData] = useState({
    title: '', content: '', tags: '', author: '', image: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'content' && value.trim() !== '') setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Content is required to publish.');
      return;
    }
    const newPost = {
      id: Date.now(),
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()),
      createdAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const updated = [newPost, ...existing];
    localStorage.setItem('blogPosts', JSON.stringify(updated));
    navigate('/');
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-[120px] bg-gray-50 px-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center p-2">
          <CardTitle className="text-xl font-bold text-purple-700">Create Blog</CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">
            Fill out the blog post details below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="block mb-1 text-sm text-gray-700 font-medium">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="content" className="block mb-1 text-sm text-gray-700 font-medium">Content</Label>
              <Textarea
                id="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div>
              <Label htmlFor="tags" className="block mb-1 text-sm text-gray-700 font-medium">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="author" className="block mb-1 text-sm text-gray-700 font-medium">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="image" className="block mb-1 text-sm text-gray-700 font-medium">Image URL (Optional)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
      <div className="text-center pt-2 bg-purple-700 text-white">
  <button
    type="submit"
    className="bg-purple-700 hover:bg-purple-700 text-white text-lg font-medium px-6 py-2 rounded-full shadow-md transition-all duration-300"
  >
    Publish
  </button>
</div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
