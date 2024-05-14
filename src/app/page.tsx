"use client"

import Image from 'next/image'
import Input from '../components/input'
import { useState } from 'react'
import { evaluateSnippet } from '../services/openai'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const institutions = ['The Globe Theater', 'Stratford Library']

export default function Home() {
	const [outputElements, setOutputElements] = useState<JSX.Element[]>([])

	const handleSubmission = async (institution: string, snippet: string) => {
    
		const processingMessage = <text key={Date.now()} className="text-sm text-green-500">Processing your snippet...</text>
		setOutputElements([processingMessage])
		const result = await evaluateSnippet(snippet)
		
		if (result) {
			const resultMessage = <text key={Date.now()} className="text-sm text-green-500">Rating: {result.rating}/5 - {result.comment}</text>
			setOutputElements(prevElements => [...prevElements, resultMessage])
    } else {
			const errorMessage = <text key={Date.now()} className="text-sm text-red-500">Failed to process snippet.</text>
			setOutputElements(prevElements => [...prevElements, errorMessage])
			return
    }

		if (result && (result.rating && result.rating > 3)) {
      const resultMessage = <text key={Date.now()} className="text-sm text-green-500">Adding snippet to training data set...</text>
			setOutputElements(prevElements => [...prevElements, resultMessage])
    } else {
			const errorMessage = <text key={Date.now()} className="text-sm text-green-500">Your snippet needs a rating of 4 or greater to be added.</text>
			setOutputElements(prevElements => [...prevElements, errorMessage])
			return
		}

  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
			<Image src="/logo.png" alt="Logo" width={150} height={150} />
			<h1 className="text-2xl font-medium mb-2">Silencio</h1>
				<a href="https://github.com/andrew-solyd/silencio" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-gray-700 transition duration-300 ease-in-out mb-1">
					View on github
				</a>
				<span className="text-xs text-gray-300 mb-1">
					{contractAddress}
				</span>	
    	<hr className="w-full border-t border-gray-300 my-2"/>
			<div className="flex flex-row justify-center w-full mt-4 space-x-12">
				<Input institutions={institutions} onSubmit={handleSubmission} />
				<div className="w-[400px] flex flex-col">
					{outputElements}
				</div>
			</div>
    </main>
  )
}

