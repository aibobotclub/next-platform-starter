import { Code } from 'bright';

interface CodeBlockProps {
  code: string;
  lang?: string;
  lineNumbers?: boolean;
  title?: string;
}

export function CodeBlock({ code, lang, lineNumbers, title }: CodeBlockProps) {
  return (
    <Code lang={lang} title={title} lineNumbers={lineNumbers} theme="poimandres">
      {code}
    </Code>
  );
} 