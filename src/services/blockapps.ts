"use server"

import axios from 'axios' 

import { getTokenFromKeycloak } from '../services/keycloak' 

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
  const tokenResponse = await getTokenFromKeycloak()  // Assuming getTokenFromKeycloak is already implemented and imported
  const url = 'https://marketplace.mercata-testnet2.blockapps.net/strato/v2.3/transaction?resolve=true' 
  const payload = {
    txs: [{
      payload: {
        contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        method: "addSnippet",
        args: {
          _text: snippet,
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