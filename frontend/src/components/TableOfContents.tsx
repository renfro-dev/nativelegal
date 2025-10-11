'use client'

import React from 'react'

interface TableOfContentsProps {
  content: string
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const headings = content
    .split('\n')
    .filter(line => line.match(/^#{1,6}\s+/))
    .filter(line => {
      const text = line.replace(/^#+\s*/, '').trim().toLowerCase()
      // Exclude common TOC headings and meta headings
      return !text.includes('table of contents') &&
             !text.includes('contents') &&
             !text.includes('overview') &&
             !text.includes('introduction') &&
             !text.includes('summary')
    })
    .map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 1
      let text = heading.replace(/^#+\s*/, '').trim()

      // Clean up markdown symbols from TOC text
      text = text
        .replace(/\{[^}]*\}/g, '') // Remove {anything}
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
        .replace(/^\*+\s*/, '') // Remove leading asterisks
        .trim()

      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const indent = level > 2 ? `ml-${(level - 2) * 4}` : ''

      return {
        id,
        text,
        level,
        indent
      }
    })

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
      <div className="space-y-2" id="table-of-contents">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-sm text-emerald-400 hover:text-emerald-300 hover:underline ${heading.indent}`}
            onClick={(e) => handleClick(e, heading.id)}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  )
}

export default TableOfContents
