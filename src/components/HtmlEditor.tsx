/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Loader from './common/loader';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export type HtmlEditorProps = {
  value?: string;
  onChangeAction?: (v: string) => void;
  placeholder?: string;
  allowFullHtml?: boolean;
};

export default function HtmlEditor({
  value = '',
  onChangeAction,
  placeholder,
  allowFullHtml = true,
}: HtmlEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  useEffect(() => setMounted(true), []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ];

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeAction?.(e.target.value);
  };

  const handleQuillChange = (content: string) => {
    onChangeAction?.(content);
  };

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`cursor-pointer rounded-md px-3 py-1 text-sm transition-colors ${
            isHtmlMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isHtmlMode ? '📝 Visual Editor' : '🔧 HTML Code'}
        </button>
      </div>

      {isHtmlMode
        ? (
            <div className="overflow-hidden rounded-md border">
              <textarea
                value={value}
                onChange={handleHtmlChange}
                placeholder="Enter HTML code here..."
                className="h-96 w-full resize-none border-0 p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
              />
            </div>
          )
        : (
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={handleQuillChange}
                modules={modules}
                placeholder={placeholder}
                formats={formats}
                preserveWhitespace={true}
              />
            </div>
          )}

      {allowFullHtml && (
        <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-gray-700">
          <p className="mb-1 font-semibold text-blue-800">💡 Pro Tip:</p>
          <p>
            Switch to HTML mode to add custom styles, classes, scripts, or any HTML code.
            All HTML will be preserved exactly as written.
          </p>
        </div>
      )}
    </div>
  );
}
