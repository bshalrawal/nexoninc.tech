'use client';

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function QuillEditor({ value, onChange }: QuillEditorProps) {
  return (
    <ReactQuill 
      theme="snow" 
      value={value} 
      onChange={onChange}
      style={{ height: '300px', marginBottom: '4rem' }}
    />
  );
}
