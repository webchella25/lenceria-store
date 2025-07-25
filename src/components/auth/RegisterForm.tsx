"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerSchema } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react"
import { toast } from "react-hot-toast"
import type { RegisterData } from "@/types/auth"

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const password = watch("password")

  // Validaciones de contraseña en tiempo real
  const passwordValidations = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /\d/.test(password || "")
  }

  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al crear cuenta")
      }

      toast.success("¡Cuenta creada exitosamente!")
      router.push("/login?message=registration-success")

    } catch (error: any) {
      toast.error(error.message || "Error al crear cuenta")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-secondary-800">
          Crear Cuenta
        </CardTitle>
        <p className="text-secondary-600">
          Únete a Lencería Store y disfruta de ofertas exclusivas
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Nombre completo
            </label>
            <Input
              type="text"
              placeholder="Tu nombre"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

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

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Validaciones de contraseña */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  {passwordValidations.length ? (
                    <Check className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <X className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={passwordValidations.length ? "text-green-600" : "text-red-600"}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {passwordValidations.uppercase ? (
                    <Check className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <X className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={passwordValidations.uppercase ? "text-green-600" : "text-red-600"}>
                    Una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {passwordValidations.lowercase ? (
                    <Check className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <X className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={passwordValidations.lowercase ? "text-green-600" : "text-red-600"}>
                    Una letra minúscula
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {passwordValidations.number ? (
                    <Check className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <X className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={passwordValidations.number ? "text-green-600" : "text-red-600"}>
                    Un número
                  </span>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-600">
              Acepto los{" "}
              <Link href="/terminos" className="text-primary-600 hover:text-primary-700">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="text-primary-600 hover:text-primary-700">
                política de privacidad
              </Link>
            </span>
          </div>

          {/* Newsletter */}
          <div className="flex items-start">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-secondary-600">
              Quiero recibir ofertas exclusivas y novedades por email
            </span>
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
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>

          {/* Link a login */}
          <p className="text-center text-sm text-secondary-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}