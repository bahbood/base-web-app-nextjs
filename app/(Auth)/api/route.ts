// app/(Auth)/api/route.ts

import { NextResponse } from 'next/server'
import { updateSession } from '@/app/(Auth)/lib/session'

export async function GET() {
  try {
    // در اینجا updateSession مجاز است چون در Route Handler است
    const result = await updateSession()
    
    if (result.success && result.user) {
      return NextResponse.json({ 
        user: result.user,
        success: true 
      })
    } else {
      return NextResponse.json({ 
        user: null,
        success: false 
      })
    }
  } catch (error) {
    return NextResponse.json({ 
      user: null,
      success: false 
    }, { status: 500 })
  }
}