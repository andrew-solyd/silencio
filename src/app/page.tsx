"use client"

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { evaluateSnippet } from '@/services/openai'
import { getGlobalStats,  addSnippet} from '@/services/blockapps'
import {getRewardWordCount} from '@/utils/snippets'
import Input from '@/components/input'
import Header from '@/components/header'
import WelcomeModal from '@/components/welcome-modal'
import AllSnippetsModal from '@/components/all-snippets-modal'
import RewardModal from '@/components/reward-modal'


const institutions = ['The Globe Theater', 'Stratford Library']
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export default function Home() {
	const [outputElements, setOutputElements] = useState<JSX.Element[]>([])
	const [globalStats, setGlobalStats] = useState({ totalWordCount: 0, datasetRating: 0 })
	const [isAllSnippetsModalOpen, setIsAllSnippetsModalOpen] = useState(false)
	const [isRewardModalOpen, setIsRewardModalOpen] = useState(false)
	const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true)
	const [contributor, setContributor] = useState<string>('')  // State to store the contributor name
	const [wordCount, setWordCount] = useState<number>(0)

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

	// TO DO: REFACTOR THIS 
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
		
		if (result && result.rating && result.rating > 2) {
			const resultMessage = <span key={uuidv4()} className="text-sm text-green-500">Adding snippet to training data set...</span> 
			setOutputElements(prevElements => [...prevElements, resultMessage])			
			try {
				await addSnippet(institution, snippet, result.rating * 100) 
				const successMessage = <span key={uuidv4()} className="text-sm text-green-500">Snippet successfully added to the blockchain</span> 
				setOutputElements(prevElements => [...prevElements, successMessage])
				const updatedStats = await getGlobalStats() 
				setGlobalStats(updatedStats)
				const wordCount = snippet.split(/\s+/).length
				const rewardWordCount = getRewardWordCount(wordCount, result.rating)
				setContributor(institution)  // Set the contributor name
				setWordCount(rewardWordCount) 
				const rewardMessage = (
					<span key={uuidv4()} className="text-sm text-green-400">
						Your contribution of {wordCount} words with rating of {result.rating} entitles you to{' '}
						<b>{rewardWordCount} Shakespearean words</b> contributed by other consortium members.{' '}
						<button
							className="border-b border-green-500 bg-transparent hover:text-green-600 hover:border-green-600"
							onClick={() => setIsRewardModalOpen(true)}
						>
							Access new data
						</button>
					</span>
				)
				setOutputElements(prevElements => [...prevElements, rewardMessage])
			} catch (error) {
				const errorMessage = <span key={uuidv4()} className="text-sm text-red-500">Failed to add snippet to blockchain.</span> 
				setOutputElements(prevElements => [...prevElements, errorMessage]) 
			}
		} else {
			const errorMessage = <span key={uuidv4()} className="text-sm text-red-500">Your snippet needs a rating of 3 or greater to be added.</span> 
			setOutputElements(prevElements => [...prevElements, errorMessage]) 
			return 
		}

  }

  return (
		<>
			<main className="flex min-h-screen flex-col items-center px-10">
				<div className="hidden sm:block">
					<Header globalStats={globalStats} />
					<div className="flex flex-row justify-center w-full mt-4 space-x-12">
						<Input institutions={institutions} onSubmit={handleSubmission} />
						<div className="w-[400px] flex flex-col">
							{outputElements}
						</div>
					</div>
					<div className="flex flex-col items-center">
						<button className="mt-10 border-b border-gray-300 text-xs bg-transparent hover:text-gray-600 hover:border-gray-600" onClick={() => setIsAllSnippetsModalOpen(true)}>
							View all snippets
						</button>
						<span className="text-xs text-gray-300 mt-3">
							0x{contractAddress} (Mercato Testnet)
						</span>	
					</div>
				</div>
				<div className="mt-2 sm:hidden text-center">
					<span className="text-sm">Silencio is available on desktop only</span>
				</div>
			</main>
			<WelcomeModal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />
			<RewardModal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} contributor={contributor} wordCount={wordCount}/>
			<AllSnippetsModal isOpen={isAllSnippetsModalOpen} onClose={() => setIsAllSnippetsModalOpen(false)} />			
		</>
  )
}

