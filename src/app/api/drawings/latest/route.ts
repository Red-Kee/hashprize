import { NextResponse } from 'next/server'
import { getLastDrawing } from '../../../../services/databaseActions'

export async function GET() {
  try {
    const lastDrawing = await getLastDrawing()
    return NextResponse.json(lastDrawing)
  } catch (error) {
    console.error('Error fetching last drawing:', error)
    return NextResponse.json({ error: 'No drawings found' }, { status: 404 })
  }
}
