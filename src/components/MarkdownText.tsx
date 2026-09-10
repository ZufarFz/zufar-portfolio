import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownTextProps {
  content: string | undefined | null;
  className?: string;
  inline?: boolean;
  theme?: 'light' | 'dark';
}

export default function MarkdownText({
  content,
  className = '',
  inline = false,
  theme
}: MarkdownTextProps) {
  if (!content) return null;

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return (
    <div className={`markdown-content ${inline ? 'inline' : 'block'} ${className}`}>
      <Markdown
        components={{
          // Paragraphs
          p: ({ children }) => (
            inline ? (
              <span className="leading-relaxed">{children}</span>
            ) : (
              <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>
            )
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className={`text-base sm:text-lg font-black mt-2 mb-1 first:mt-0 tracking-tight ${
              isLight ? 'text-slate-900' : isDark ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-sm sm:text-base font-extrabold mt-2 mb-1 first:mt-0 tracking-tight ${
              isLight ? 'text-slate-900' : isDark ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xs sm:text-sm font-bold mt-1.5 mb-0.5 first:mt-0 tracking-tight ${
              isLight ? 'text-slate-900' : isDark ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`text-[11px] sm:text-xs font-bold mt-1 mb-0.5 first:mt-0 tracking-tight ${
              isLight ? 'text-slate-900' : isDark ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {children}
            </h4>
          ),
          // Strong / Bold
          strong: ({ children }) => (
            <strong className={`font-bold ${
              isLight ? 'text-slate-950' : isDark ? 'text-white' : 'text-inherit font-extrabold'
            }`}>
              {children}
            </strong>
          ),
          // Emphasis / Italic
          em: ({ children }) => (
            <em className={`italic font-medium ${
              isLight ? 'text-slate-800' : isDark ? 'text-slate-200' : 'text-inherit'
            }`}>
              {children}
            </em>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 hover:underline-offset-4 transition-all inline-flex items-center gap-0.5 cursor-pointer select-text"
            >
              {children}
            </a>
          ),
          // Inline code & Code blocks
          code: ({ className: codeClassName, children, ...props }) => {
            const isCodeBlock = codeClassName?.includes('language-');
            if (isCodeBlock) {
              return (
                <div className="my-1.5 rounded-lg bg-slate-950 p-2.5 border border-slate-800 overflow-x-auto text-[11px] font-mono text-emerald-400 shadow-inner">
                  <code {...props}>{children}</code>
                </div>
              );
            }
            return (
              <code
                className={`font-mono text-[0.88em] px-1.5 py-0.5 rounded font-semibold border ${
                  isLight 
                    ? 'bg-slate-100 text-emerald-800 border-slate-200' 
                    : isDark 
                      ? 'bg-slate-900 text-emerald-300 border-slate-750' 
                      : 'bg-slate-150 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border-slate-300/60 dark:border-slate-700/60'
                }`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-emerald-500 pl-2.5 my-1.5 text-xs italic text-slate-600 dark:text-slate-400 bg-emerald-500/5 py-0.5 rounded-r">
              {children}
            </blockquote>
          ),
          // Unordered Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-3.5 my-1 space-y-0.5">
              {children}
            </ul>
          ),
          // Ordered Lists
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-3.5 my-1 space-y-0.5">
              {children}
            </ol>
          ),
          // List Items
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // Horizontal Rule
          hr: () => (
            <hr className="my-2.5 border-t border-slate-200 dark:border-slate-800" />
          )
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

export { MarkdownText };
