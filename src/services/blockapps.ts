"use server"

import axios from 'axios' 

import { getTokenFromKeycloak } from '@/services/keycloak' 

interface TransactionResponse {
  data: {
    contents: string[] 
    tag: string 
  } 
  hash: string 
  status: string 
  txResult: any 
}

interface GlobalStats {
  totalWordCount: number 
  datasetRating: number 
}

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const tokenResponse = await getTokenFromKeycloak() 
  const url = 'https://marketplace.mercata-testnet2.blockapps.net/strato/v2.3/transaction?resolve=true' 
  const payload = {
    txs: [{
      payload: {
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: "getGlobalStats",
        args: {},
        metadata: {}
      },
      type: "FUNCTION"
    }]
  } 

  const headers = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
    'Content-Type': 'application/json'
  } 

  try {
    const response = await axios.post<TransactionResponse[]>(url, payload, { headers }) 
    const contents = response.data[0].data.contents 
    return {
      totalWordCount: parseInt(contents[0], 10),
      datasetRating: parseInt(contents[1], 10)
    } 
  } catch (error) {
    console.error('Error posting transaction:', error) 
    throw error 
  }
} 

export const addSnippet = async (institution: string, snippet: string, rating: number) => {
  const wordCount = snippet.split(/\s+/).length  // Count words in the snippet
	const cleanedSnippet = snippet.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ').trim() // Remove non-word characters and punctuation from the snippet
  const tokenResponse = await getTokenFromKeycloak()  // Assuming getTokenFromKeycloak is already implemented and imported
  const url = 'https://marketplace.mercata-testnet2.blockapps.net/strato/v2.3/transaction?resolve=true' 
  const payload = {
    txs: [{
      payload: {
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: "addSnippet",
        args: {
          _text: cleanedSnippet,
          _contributor: institution,
          _rating: rating,
          _wordCount: wordCount
        },
        metadata: {}
      },
      type: "FUNCTION"
    }]
  } 

  const headers = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
    'Content-Type': 'application/json'
  } 

  try {
    const response = await axios.post(url, payload, { headers }) 
  } catch (error) {
    console.error('Error posting transaction to add snippet:', error) 
    throw error 
  }
} 

export const getAllSnippets = async () => {
  const tokenResponse = await getTokenFromKeycloak()
  const url = 'https://marketplace.mercata-testnet2.blockapps.net/strato/v2.3/transaction?resolve=true'
  const payload = {
    txs: [{
      payload: {
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: "getSnippetCount",
        args: {},
        metadata: {}
      },
      type: "FUNCTION"
    }]
  }

  const headers = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
    'Content-Type': 'application/json'
  }

  try {
    // First, get the count of snippets
    const countResponse = await axios.post<TransactionResponse[]>(url, payload, { headers })
    if (!countResponse.data || countResponse.data.length === 0 || !countResponse.data[0].data) {
      console.error('No data returned for snippet count')
      return []
    }
    const snippetCount = parseInt(countResponse.data[0].data.contents[0], 10)

    // Now fetch each snippet using a loop
    let snippets = []
    for (let i = 0; i < snippetCount; i++) {
      payload.txs[0].payload.method = "getSnippet"
      payload.txs[0].payload.args = { index: i }

      const snippetResponse = await axios.post<TransactionResponse[]>(url, payload, { headers })
      if (!snippetResponse.data || snippetResponse.data.length === 0 || !snippetResponse.data[0].data) {
        console.error(`No data returned for snippet at index ${i}`)
        continue // Skip this iteration if data is missing
      }
      const snippetData = snippetResponse.data[0].data.contents
      snippets.push({
        text: snippetData[0],
        timestamp: parseInt(snippetData[1], 10),
        contributor: snippetData[2],
        rating: parseInt(snippetData[3], 10),
        wordCount: parseInt(snippetData[4], 10)
      })
    }

    return snippets
  } catch (error) {
    console.error('Error fetching snippets:', error)
    throw error
  }
}