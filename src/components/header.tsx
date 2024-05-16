import Image from 'next/image'

interface HeaderProps {
  globalStats?: {
    totalWordCount: number
    datasetRating: number
  }
}

export default function Header({ globalStats }: HeaderProps) {
  return (
		<>
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-col w-[300px] mt-10">
					<span className="mb-3"> Powered by </span>
					<Image src="/mercata_logo.png" alt="Logo" width={150} height={150} />
				</div>
				<div className="flex flex-col items-center" >
					<Image src="/logo.png" alt="Logo" width={150} height={150} />
					<h1 className="text-2xl font-medium mb-2">Silencio</h1>
				</div>
				<div className="flex flex-col w-[300px] mt-10">
					<span className="text-right">
						Data word count: {globalStats ? globalStats.totalWordCount : 'Loading...'}
					</span>  
					<span className="text-right">
						Data quality rating: {globalStats ? (globalStats.datasetRating / 100).toFixed(2) : 'Loading...'}
					</span>
				</div>
			</div>
			<a href="https://github.com/andrew-solyd/silencio" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-gray-700 transition duration-300 ease-in-out mb-1">
				View source code and learn more
			</a>					
			<hr className="w-full border-t border-gray-300 my-2"/>
		</>

  )
}