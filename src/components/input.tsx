import React, { useState } from 'react'

interface InputProps {
  institutions: string[]
  onSubmit: (institution: string, snippet: string) => void
}

const Input: React.FC<InputProps> = ({ institutions, onSubmit }) => {
  const [selectedInstitution, setSelectedInstitution] = useState<string>('')
  const [snippet, setSnippet] = useState<string>('')

  const handleSubmit = () => {
    if (selectedInstitution && snippet) {
      onSubmit(selectedInstitution, snippet)
    } else {
      alert('Please select an institution and enter a snippet.')
    }
  }

  return (
    <div className="w-[400px]">
      <span className="text-sm">Please select your member institution and submit snippet</span>
      <div className="my-2 flex flex-row space-x-5">
        {institutions.map((institution, index) => (
          <label key={index} className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="institution"
              value={institution}
              checked={selectedInstitution === institution}
              onChange={() => setSelectedInstitution(institution)}
              className="text-gray-600 focus:ring-gray-500 accent-gray-500"
            />
            <span className={`text-sm text-white ${selectedInstitution === institution ? 'underline' : ''}`}>{institution}</span>
          </label>
        ))}
      </div>
      <textarea
        placeholder="Enter snippet here"
        className="p-2 border border-gray-300 rounded-md bg-black text-white text-lg w-full h-[300px]"
        aria-label="Snippet Input"
        value={snippet}
        onChange={(e) => setSnippet(e.target.value)}
      />
      <div className="w-full flex flex-row items-end justify-end">
        <button
          type="button"
          className="text-sm mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
          onClick={handleSubmit}
        >
          Submit snippet
        </button>
      </div>
    </div>
  )
}

export default Input