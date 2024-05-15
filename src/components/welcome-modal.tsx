
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const WelcomeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-10">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-zinc-950 text-white p-5 rounded-lg z-10 max-h-[80vh] overflow-auto">
				<div className="flex flex-col w-[500px] h-[500px] justify-between px-10">
					<h1 className="text-xl text-center mb-2 font-semibold">What is this?</h1>
					<p>
						Welcome to Silencio, a practical demonstration of using private blockchain for secure data sharing in AI model training. In this demo, consortium members contribute Shakespearean text segments, which are evaluated for quality and added to a shared data pool. Contributors are rewarded with access to matching datasets based on the quality and amount of their contributions.
					</p>
					<p className="mt-2">
						We have two consortium members: The Globe Theater and Stratford Library. To participate, select your institution, enter a text segment, and our AI system will provide a quality score. Click <b>Access New Data</b> to view your reward - a new Shakespearean text snippet from another member.
					</p>
					<p className="mt-2">
						Silencio showcases how private blockchain enables secure, transparent, and fair data sharing for collaborative AI training while preserving data privacy and ownership.
					</p>
					<div className="flex flex-row w-full justify-end">
						<button onClick={onClose} className="text-sm mt-4 bg-transparent border-b border-gray-300 hover:text-gray-600 hover:border-gray-600">
							Close
						</button>
					</div>
				</div> 
      </div>
    </div>
  )
}

export default WelcomeModal