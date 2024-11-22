import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Icon } from '@assets/icons.tsx'
import { useSendPost } from '@hooks/posts'
import { Button } from "@src/atoms/button"

export const InputPost = ({ communityId, channelId }: any) => {
  const { sendMessage } = useSendPost({ communityId, channelId });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: 'Type a message...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[20px] max-h-[300px] overflow-y-auto p-3 font-light',
      },
    },
  })

  const handleSendMessage = async () => {
    if (!editor) return;
    const content = editor.getJSON();

    editor.commands.clearContent();
    await sendMessage({ content });
  };

  return (
    <div className='bg-app w-full px-mini pb-mini'>
      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden w-full">
        <div className="p-2">
          <EditorContent editor={editor} />
        </div>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
          </div>
          <Button
            className={`bg-darkBlue text-white rounded-md px-4 py-1 flex items-center justify-center`}
            type="button"
            onClick={handleSendMessage}
          >
            <Icon type="Send" size={16} color="white" variant="Bold" className="mr-1" />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  )
}