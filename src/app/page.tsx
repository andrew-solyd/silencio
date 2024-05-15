"use client"

import Image from 'next/image'
import Input from '../components/input'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { evaluateSnippet } from '../services/openai'
import { getGlobalStats,  addSnippet} from '../services/blockapps'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const institutions = ['The Globe Theater', 'Stratford Library']

export default function Home() {
	const [outputElements, setOutputElements] = useState<JSX.Element[]>([])
	const [globalStats, setGlobalStats] = useState({ totalWordCount: 0, datasetRating: 0 })

	useEffect(() => {
		const fetchGlobalStats = async () => {
			try {
				const stats = await getGlobalStats()
				setGlobalStats(stats)
			} catch (error) {
				console.error('Failed to fetch global stats:', error)
			}
		}
		fetchGlobalStats()
	}, [])

	const handleSubmission = async (institution: string, snippet: string) => {
    setOutputElements([])
		const processingMessage = <span key={uuidv4()} className="text-sm text-green-500">Processing your snippet...</span>
		setOutputElements([processingMessage])
		const result = await evaluateSnippet(snippet)
		
		if (result) {
			const resultMessage = <span key={uuidv4()} className="text-sm text-green-500">Rating: {result.rating}/5 - {result.comment}</span>
			setOutputElements(prevElements => [...prevElements, resultMessage])
    } else {
			const errorMessage = <span key={uuidv4()} className="text-sm text-red-500">Failed to process snippet.</span>
			setOutputElements(prevElements => [...prevElements, errorMessage])
			return
    }
		
		if (result && result.rating && result.rating > 3) {
			const resultMessage = <span key={uuidv4()} className="text-sm text-green-500">Adding snippet to training data set...</span> 
			setOutputElements(prevElements => [...prevElements, resultMessage])			
			try {
				await addSnippet(institution, snippet, result.rating) 
				const successMessage = <span key={uuidv4()} className="text-sm text-green-500">Snippet successfully added to the blockchain</span> 
				setOutputElements(prevElements => [...prevElements, successMessage]) 
				const updatedStats = await getGlobalStats() 
				setGlobalStats(updatedStats) 
			} catch (error) {
				const errorMessage = <span key={uuidv4()} className="text-sm text-red-500">Failed to add snippet to blockchain.</span> 
				setOutputElements(prevElements => [...prevElements, errorMessage]) 
			}
		} else {
			const errorMessage = <span key={uuidv4()} className="text-sm text-red-500">Your snippet needs a rating of 4 or greater to be added.</span> 
			setOutputElements(prevElements => [...prevElements, errorMessage]) 
			return 
		}

  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
			<div className="flex flex-row w-full justify-between">
				<div className="w-[300px]"></div>
				<div className="flex flex-col items-center" >
					<Image src="/logo.png" alt="Logo" width={150} height={150} />
					<h1 className="text-2xl font-medium mb-2">Silencio</h1>
				</div>
				<div className="flex flex-col w-[300px] mt-10">
					<span className="text-2xl text-gray-300">
						Word Count: {globalStats.totalWordCount}
					</span>	
					<span className="text-2xl text-gray-300">
						Data Quality Rating: {globalStats.datasetRating / 100}
					</span>	
				</div>
			</div>
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

