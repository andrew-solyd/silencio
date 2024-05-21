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

interface Snippet {
  text: string;
  timestamp: number;
  contributor: string;
  rating: number;
  wordCount: number;
}

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const tokenResponse = await getTokenFromKeycloak();
  const url = `https://marketplace.mercata-testnet2.blockapps.net/bloc/v2.2/contracts/${process.env.NEXT_PUBLIC_CONTRACT_NAME}/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/state`;

  const headers = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const stateData = response.data;
    return {
      totalWordCount: parseInt(stateData.totalWordCount, 10),
      datasetRating: parseInt(stateData.datasetRating, 10)
    };
  } catch (error) {
    console.error('Error fetching global stats:', error);
    throw new Error('Error fetching global stats. Please try again later.');
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
    await axios.post(url, payload, { headers }) 
    return "Snippet added successfully"
  } catch (error) {
    console.error('Error posting transaction to add snippet:', error) 
    return `Error adding snippet: ${error}`
  }
} 

export const getAllSnippets = async (): Promise<Snippet[]> => {
  const tokenResponse = await getTokenFromKeycloak();
  const url = `https://marketplace.mercata-testnet2.blockapps.net/bloc/v2.2/contracts/${process.env.NEXT_PUBLIC_CONTRACT_NAME}/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/state`;

  const headers = {
    Authorization: `Bearer ${tokenResponse.access_token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const snippetsData = response.data.snippets as Snippet[];
    return snippetsData.map(snippet => ({
      text: snippet.text,
      timestamp: snippet.timestamp,
      contributor: snippet.contributor,
      rating: snippet.rating,
			wordCount: snippet.wordCount 
    }));
  } catch (error) {
    console.error('Error fetching snippets:', error);
    throw new Error('Error fetching snippets. Please try again later.');
  }
}