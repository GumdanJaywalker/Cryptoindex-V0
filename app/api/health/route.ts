// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    const supabaseStatus = error ? 'error' : 'connected'

    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      jwtSecret: !!process.env.JWT_SECRET,
      emailService: !!process.env.EMAIL_FROM,
    }

    const allEnvVarsPresent = Object.values(envCheck).every(Boolean)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        supabase: supabaseStatus,
        database: supabaseStatus === 'connected' ? 'connected' : 'error'
      },
      config: {
        environmentVariables: envCheck,
        allConfigured: allEnvVarsPresent
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 503 })
  }
}
