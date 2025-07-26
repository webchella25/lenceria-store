import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Test básico de base de datos
    await prisma.$queryRaw`SELECT 1`
    
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: "connected",
      stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "missing",
      version: "1.0.0"
    }
    
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error", 
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}