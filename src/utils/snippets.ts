import { getAllSnippets } from '@/services/blockapps'

export const getRewardWordCount = (wordCount: number, rating: number): number => {
  let adjustedWordCount: number

  if (rating <= 3) {
    adjustedWordCount = Math.floor(wordCount * 0.8)
  } else if (rating === 4) {
    adjustedWordCount = Math.floor(wordCount * 0.9)
  } else {
    adjustedWordCount = wordCount
  }

  return Math.max(adjustedWordCount, 1)
}

export const getRecentSnippetFromOthers = async (contributor: string, wordCount: number): Promise<{ text: string, contributor: string, timestamp: number }> => {
  try {
    // Fetch all snippets from the blockchain
    const snippets = await getAllSnippets()

    // Filter out snippets from the specified contributor
    const otherContributorsSnippets = snippets.filter(snippet => snippet.contributor !== contributor)

    // Find the most recent snippet with at least the specified word count
    let suitableSnippet = otherContributorsSnippets
      .filter(snippet => snippet.wordCount >= wordCount)
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp descending
      .find(() => true) // Get the first item after sorting

    // If no suitable snippet is found, find the one with the most words
    if (!suitableSnippet) {
      suitableSnippet = otherContributorsSnippets
        .sort((a, b) => b.wordCount - a.wordCount || b.timestamp - a.timestamp)
        .find(() => true);
    }

    // Final check to throw an error if no snippet is found at all
    if (!suitableSnippet) {
      throw new Error('No suitable snippet found.');
    }

    // Return the snippet text truncated to the specified word count
    return {
      text: suitableSnippet.text.split(' ').slice(0, wordCount).join(' '),
      contributor: suitableSnippet.contributor,
      timestamp: suitableSnippet.timestamp
    }
  } catch (error) {
    console.error('Error retrieving recent snippet:', error)
    throw error
  }
}