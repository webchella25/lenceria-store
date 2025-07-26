"use client"

import { Badge } from '@/components/ui/Badge'
import { AlertTriangle } from 'lucide-react'

interface TestModeNoticeProps {
  show?: boolean
}

export default function TestModeNotice({ show = true }: TestModeNoticeProps) {
  const isTestMode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')

  if (!show || !isTestMode) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
          Modo Test
        </Badge>
        <span className="text-sm text-yellow-700">
          Usa la tarjeta 4242 4242 4242 4242 para testing
        </span>
      </div>
    </div>
  )
}