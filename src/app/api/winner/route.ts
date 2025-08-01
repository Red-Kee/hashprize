import { NextRequest, NextResponse } from 'next/server'
import { getWinner } from '../../../services/databaseActions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const randomNumber = searchParams.get('randomNumber')

    if (!randomNumber) {
      return NextResponse.json({ error: 'Random number is required' }, { status: 400 })
    }

    const winner = await getWinner(parseInt(randomNumber))
    
    if (!winner) {
      return NextResponse.json({ error: 'No winner found' }, { status: 404 })
    }

    return NextResponse.json(winner)
  } catch (error) {
    console.error('Error finding winner:', error)
    return NextResponse.json({ error: 'Failed to find winner' }, { status: 500 })
  }
}
