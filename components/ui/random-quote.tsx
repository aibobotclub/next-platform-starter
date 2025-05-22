import { useEffect, useState } from 'react';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay'
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs'
  },
  {
    text: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs'
  },
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs'
  },
  {
    text: 'Design is not just what it looks like and feels like. Design is how it works.',
    author: 'Steve Jobs'
  }
];

export function RandomQuote() {
  const [quote, setQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <blockquote className="border-l-4 border-blue-500 pl-4">
      <p className="text-lg font-medium">{quote.text}</p>
      <footer className="mt-2 text-sm text-gray-500">— {quote.author}</footer>
    </blockquote>
  );
} 