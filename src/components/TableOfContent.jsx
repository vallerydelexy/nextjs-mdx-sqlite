'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);

  const cleanHeadingText = (text) => {
    return text
      .toString()
      .replace(/[*_`]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-") 
      .replace(/[^\w-]/g, "") 
      .replace(/--+/g, "-");
  };

  useEffect(() => {
    const extractHeadings = (mdxContent) => {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = [...mdxContent.matchAll(headingRegex)];
      
      return matches.map((match) => {
        const text = match[2];
        // Remove Markdown formatting before generating ID
        const cleanText = text.replace(/[*_`]/g, '');
        const id = cleanHeadingText(cleanText);
          
        return {
          id,
          level: match[1].length,
          text: cleanText, // Use cleaned text for display
        };
      });
    };

    setHeadings(extractHeadings(content));
  }, [content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  

  return (
    <Card className="p-4 sticky top-20 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h3 className="font-semibold mb-4">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className="cursor-pointer hover:text-blue-500 transition-colors"
              style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
};

export default TableOfContents;