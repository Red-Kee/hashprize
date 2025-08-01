import { NextResponse } from 'next/server'
import { getTotalAccounts, getTotalAccountBalances } from '../../../services/databaseActions'

export async function GET() {
  try {
    const totalAccounts = await getTotalAccounts()
    const totalStaked = await getTotalAccountBalances()
    
    return NextResponse.json({
      totalAccounts,
      totalStaked
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
