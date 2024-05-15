import React, { useEffect, useState } from 'react'
import { getRecentSnippetFromOthers } from '@/utils/snippets'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  contributor: string
  wordCount: number
}

const RewardModal: React.FC<ModalProps> = ({ isOpen, onClose, contributor, wordCount }) => {
  const [snippetData, setSnippetData] = useState<{ text: string, contributor: string, timestamp: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      getRecentSnippetFromOthers(contributor, wordCount)
        .then(data => {
          setSnippetData(data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Failed to fetch snippet:', error)
          setIsLoading(false)
        })
    }
  }, [isOpen, contributor, wordCount])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-10">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-zinc-950 text-white p-5 rounded-lg z-10 max-h-[80vh] overflow-auto">
        <h1 className="text-xl text-center mb-2 font-semibold">Data Contribution Reward Snippet</h1>
        {isLoading ? (
          <p>Loading snippet...</p>
        ) : snippetData ? (
          <div className="p-2 m-2 bg-zinc-700 rounded-lg flex flex-col items-center">
            <p className="text-xs">{new Date(snippetData.timestamp * 1000).toLocaleString()}</p>
            <p className="text-xl italic text-center px-10 py-2">&quot;{snippetData.text}&quot;</p>
            <p className="text-xs">Contributor: {snippetData.contributor}</p>
          </div>
        ) : (
          <p>No suitable snippet found.</p>
        )}
        <div className="flex flex-row w-full justify-end">
          <button onClick={onClose} className="text-sm mt-4 bg-transparent border-b border-gray-300 hover:text-gray-600 hover:border-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default RewardModal