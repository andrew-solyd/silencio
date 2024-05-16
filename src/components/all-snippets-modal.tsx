import { useState, useEffect } from 'react'
import { getAllSnippets } from '@/services/blockapps'

interface Snippet {
  text: string
  timestamp: number
  contributor: string
  rating: number
  wordCount: number
}

interface AllSnippetsModalProps {
  isOpen: boolean
  onClose: () => void
}

const AllSnippetsModal: React.FC<AllSnippetsModalProps> = ({ isOpen, onClose }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSnippets = async () => {
      setIsLoading(true)
      try {
        const fetchedSnippets = await getAllSnippets()

        if (fetchedSnippets.every(snippet => typeof snippet === 'object' && 'text' in snippet && 'timestamp' in snippet && 'contributor' in snippet && 'rating' in snippet && 'wordCount' in snippet)) {
          setSnippets(fetchedSnippets as Snippet[])
        } else {
          setError('Invalid data format received')
        }
      } catch (error: any) {
        setError('Failed to load snippets: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchSnippets()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-10">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-zinc-950 text-white p-5 rounded-lg z-10 max-h-[80vh] overflow-auto">
        <h1 className="text-xl text-center mb-2 font-semibold">All Snippets</h1>
        {isLoading ? (
          <p>Loading snippets...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="w-full overflow-auto">
            {snippets.map((snippet, index) => (
              <div key={index} className="p-2 m-2 bg-zinc-700 rounded-lg flex flex-col items-center">
                <p className="text-xs">{new Date(snippet.timestamp * 1000).toLocaleString()}</p>
                <p className="text-xl italic text-center px-10 py-2">&quot;{snippet.text}&quot;</p>
                <p className="text-xs">Contributor: {snippet.contributor}</p>
                <p className="text-xs">Rating: {snippet.rating / 100}</p>                
              </div>
            ))}
          </div>
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

export default AllSnippetsModal
