"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { forgotPasswordSchema } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"
import type { ForgotPasswordData } from "@/types/auth"

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar email")
      }

      setIsSubmitted(true)
      toast.success("Email enviado exitosamente")

    } catch (error: any) {
      toast.error(error.message || "Error al enviar email")
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-secondary-800">
            Email Enviado
          </CardTitle>
          <p className="text-secondary-600">
            Si tu email está registrado, recibirás un enlace para restablecer tu contraseña
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-secondary-600">
            <p>No has recibido el email?</p>
            <p>Revisa tu carpeta de spam o</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              intenta de nuevo
            </button>
          </div>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-secondary-800">
          Recuperar Contraseña
        </CardTitle>
        <p className="text-secondary-600">
          Introduce tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Botón submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Enlace de Recuperación"
            )}
          </Button>

          {/* Link a login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}