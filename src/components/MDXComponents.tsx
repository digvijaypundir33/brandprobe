import Link from 'next/link';
import { ReactNode } from 'react';

// Helper function to generate slug from heading text
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Custom components for MDX rendering
export const MDXComponents = {
  h1: ({ children }: { children: ReactNode }) => {
    const id = typeof children === 'string' ? generateSlug(children) : '';
    return (
      <h1 id={id} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8 scroll-mt-20 leading-tight">
        {children}
      </h1>
    );
  },
  h2: ({ children }: { children: ReactNode }) => {
    const id = typeof children === 'string' ? generateSlug(children) : '';
    return (
      <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 mt-6 sm:mt-8 scroll-mt-20 leading-tight">
        {children}
      </h2>
    );
  },
  h3: ({ children }: { children: ReactNode }) => {
    const id = typeof children === 'string' ? generateSlug(children) : '';
    return (
      <h3 id={id} className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 mt-5 sm:mt-6 scroll-mt-20 leading-tight">
        {children}
      </h3>
    );
  },
  h4: ({ children }: { children: ReactNode }) => {
    const id = typeof children === 'string' ? generateSlug(children) : '';
    return (
      <h4 id={id} className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 mt-4 scroll-mt-20 leading-tight">
        {children}
      </h4>
    );
  },
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-outside space-y-2 mb-4 text-base sm:text-lg text-gray-700 ml-5 sm:ml-6 pl-1">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal list-outside space-y-2 mb-4 text-base sm:text-lg text-gray-700 ml-5 sm:ml-6 pl-1">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="leading-relaxed pl-1">{children}</li>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2 my-4 italic text-base sm:text-lg text-gray-700 bg-blue-50 rounded-r-lg">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: ReactNode; className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded text-sm sm:text-base font-mono break-words">
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} block bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm`}>
        {children}
      </code>
    );
  },
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto mb-4 -mx-4 sm:mx-0">
      {children}
    </pre>
  ),
  a: ({ href, children }: { href?: string; children: ReactNode }) => {
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href || '#'} className="text-blue-600 hover:text-blue-700 underline">
        {children}
      </Link>
    );
  },
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img
      src={src}
      alt={alt || ''}
      className="rounded-lg my-4 sm:my-6 w-full border border-gray-200"
    />
  ),
  table: ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto my-6 -mx-4 sm:mx-0">
      <table className="min-w-full border border-gray-200 rounded-none sm:rounded-lg">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-2 text-left font-semibold text-sm sm:text-base text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="border-b border-gray-200 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
};
