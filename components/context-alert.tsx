'use client'
import { getNetlifyContext } from '@/utils';
import { Alert } from './ui/alert';
import { Markdown } from './ui/markdown';

const noNetlifyContextAlert = `
For full functionality, either run this site locally via \`netlify dev\`
([see docs](https://docs.netlify.com/cli/local-development/")) or deploy it to Netlify.
`;

interface ContextAlertProps {
  addedChecksFunction?: (ctx: any) => string | null;
  className?: string;
}

export function ContextAlert({ addedChecksFunction, className }: ContextAlertProps) {
  const ctx = getNetlifyContext();

  let markdownText: string | null = null;
  if (!ctx) {
    markdownText = noNetlifyContextAlert;
  } else if (addedChecksFunction) {
    markdownText = addedChecksFunction(ctx);
  }

  if (markdownText) {
    return (
      <Alert variant="default" className={className}>
        <Markdown>{markdownText}</Markdown>
      </Alert>
    );
  }
  
  return null;
} 