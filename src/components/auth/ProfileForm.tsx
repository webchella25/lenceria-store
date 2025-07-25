"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { profileUpdateSchema, changePasswordSchema } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react"
import { toast } from "react-hot-toast"

interface ProfileData {
  name: string
  email: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export function ProfileForm() {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const { data: session, update } = useSession()

  // Formulario de perfil
  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || ""
    }
  })

  // Formulario de contraseña
  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(changePasswordSchema)
  })

  const onProfileSubmit = async (data: ProfileData) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar perfil")
      }

      // Actualizar sesión
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email
        }
      })

      toast.success("Perfil actualizado exitosamente")

    } catch (error: any) {
      toast.error(error.message || "Error al actualizar perfil")
    }
  }

  const onPasswordSubmit = async (data: PasswordData) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al cambiar contraseña")
      }

      passwordForm.reset()
      toast.success("Contraseña cambiada exitosamente")

    } catch (error: any) {
      toast.error(error.message || "Error al cambiar contraseña")
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "password"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Cambiar Contraseña
          </button>
        </nav>
      </div>

      {/* Formulario de perfil */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Información Personal</CardTitle>
            <p className="text-secondary-600">
              Actualiza tu información de perfil
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  {...profileForm.register("name")}
                  className={profileForm.formState.errors.name ? "border-red-500" : ""}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {profileForm.formState.errors.name.message}
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
                  {...profileForm.register("email")}
                  className={profileForm.formState.errors.email ? "border-red-500" : ""}
                />
                {profileForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información de cuenta</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Miembro desde:</strong> {new Date(session?.user?.createdAt || "").toLocaleDateString()}</p>
                  <p><strong>Rol:</strong> {session?.user?.role === "CUSTOMER" ? "Cliente" : "Administrador"}</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Perfil"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulario de contraseña */}
      {activeTab === "password" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Cambiar Contraseña</CardTitle>
            <p className="text-secondary-600">
              Actualiza tu contraseña para mantener tu cuenta segura
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              {/* Contraseña actual */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Contraseña actual
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? "text" : "password"}
                    {...passwordForm.register("currentPassword")}
                    className={passwordForm.formState.errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                    className={passwordForm.formState.errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? "text" : "password"}
                    {...passwordForm.register("confirmNewPassword")}
                    className={passwordForm.formState.errors.confirmNewPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmNewPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {passwordForm.formState.errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Después de cambiar tu contraseña, tendrás que iniciar sesión nuevamente en todos tus dispositivos.
                </p>
              </div>

              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cambiando...
                  </>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}