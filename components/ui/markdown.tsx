import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
} 