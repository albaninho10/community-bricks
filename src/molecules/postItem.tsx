import Document from '@tiptap/extension-document';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import { generateHTML } from '@tiptap/html';
import { Message } from '@interfaces/community';
import { useMemo } from 'react';

interface MessageProps {
    userName: string;
    content: Message;
}

const postContentStyles = `
  .post-content img {
    display: none;
  }
`;

export const PostItem: React.FC<MessageProps> = ({ userName, content }) => {

    const [contentHtml, imageUrls] = useMemo(() => {
        let html = '';
        const images: string[] = [];
        if (typeof content?.content === "string") {
            try {
                const contentJSON = JSON.parse(content.content);
                html = generateHTML(contentJSON, [
                    Document, Paragraph, Text, Mention, Image, Bold, Italic, Strike, Link
                ]);
            } catch {
                html = content.content;
            }
        } else {
            html = generateHTML(content?.content, [
                Document, Paragraph, Text, Mention, Image, Bold, Italic, Strike, Link
            ]);
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgElements = doc.getElementsByTagName('img');
        Array.from(imgElements).forEach((img) => {
            images.push(img.src);
        });

        return [doc.body.innerHTML, images];
    }, [content]);

    console.log(content)

    return (
        <div className="p-2">

            <style dangerouslySetInnerHTML={{ __html: postContentStyles }} />

            <p className="font-bold text-sm">
                {userName}
            </p>
            {contentHtml && (
                <div
                    className="font-light text-left post-content"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            )}
            {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};