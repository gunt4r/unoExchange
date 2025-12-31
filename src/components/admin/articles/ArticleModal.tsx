/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client';

import type { ArticleType } from '@/models/article';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import HtmlEditor from '@/components/HtmlEditor';
import { useArticles, useCreateArticle, useUpdateArticle } from '@/queries/useArticles';
import { useArticleModal } from '@/stores/useArticleStore';

export default function ArticleModal() {
  const { isOpen, editingId, closeModal } = useArticleModal();
  const { data: articles } = useArticles();
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    html: '',
    type: 'article' as ArticleType,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingId && articles) {
      const article = articles.find(a => a.id === editingId);
      if (article) {
        setFormData({
          image: article.image || '',
          title: article.title,
          html: article.html,
          type: article.type,
          isActive: article.isActive,
        });
      }
    } else {
      setFormData({
        image: '',
        title: '',
        html: '',
        type: 'article',
        isActive: true,
      });
    }
    setErrors({});
  }, [editingId, articles, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.html.trim()) {
      newErrors.html = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        }, {
          onSuccess: () => {
            toast.success('Article updated successfully');
          },
          onError: () => {
            toast.error('Failed to update article');
          },
        });
      } else {
        await createMutation.mutateAsync(formData, {
          onSuccess: () => {
            toast.success('Article created successfully');
          },
          onError: () => {
            toast.error('Failed to create article');
          },
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={closeModal}
    >
      <button
        type="button"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold">
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter article title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium">Image URL</p>
            <input
              type="text"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Type
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as ArticleType })}
              className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option className="cursor-pointer"value="article">Article</option>
              <option className="cursor-pointer"value="news">News</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Content (HTML)
              {' '}
              <span className="text-red-500">*</span>
            </label>
            <HtmlEditor
              value={formData.html}
              onChangeAction={e => setFormData({ ...formData, html: e })}
              placeholder="Content"
            />
            {errors.html && (
              <p className="mt-1 text-sm text-red-500">{errors.html}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </button>
    </div>
  );
}
