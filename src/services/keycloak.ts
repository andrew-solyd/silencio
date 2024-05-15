"use server"

import axios from 'axios' 

interface KeycloakTokenResponse {
  access_token: string 
  expires_in: number 
  refresh_expires_in: number 
  refresh_token: string 
  token_type: string 
  id_token: string 
  not_before_policy: number 
  session_state: string 
  scope: string 
}

export const getTokenFromKeycloak = async (): Promise<KeycloakTokenResponse> => {
  const url = 'https://keycloak.blockapps.net/auth/realms/mercata-testnet2/protocol/openid-connect/token' 

  const credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64') 

  const headers = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  } 
  const data = new URLSearchParams({
    grant_type: 'password',
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || ''
  }) 

  try {
    const response = await axios.post(url, data, { headers }) 
    return response.data 
  } catch (error) {
    console.error('Error fetching token from Keycloak:', error) 
    throw error 
  }
} 
