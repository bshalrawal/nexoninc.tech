'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const TiptapToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('strike') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="icon"
        variant={editor.isActive('blockquote') ? 'default' : 'outline'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
        <Button
        type="button"
        size="icon"
        variant='outline'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant='outline'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant='outline'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

const Tiptap = ({
  content,
  onChange,
}: {
  content: string
  onChange: (richText: string) => void
}) => {
  const editor = useEditor({
    extensions: [StarterKit.configure({
        // Disable heading levels that are not needed
        heading: {
            levels: [1, 2, 3],
        },
    })],
    content: content,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none rounded-b-md border border-t-0 border-input bg-transparent px-3 py-2 min-h-[300px]',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="w-full">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export const TiptapEditor = Tiptap;
