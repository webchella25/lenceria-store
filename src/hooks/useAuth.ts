import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Credenciales inválidas")
        return false
      }

      toast.success("¡Bienvenido!")
      router.push("/mi-cuenta")
      return true
    } catch (error) {
      toast.error("Error al iniciar sesión")
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success("Sesión cerrada")
      router.push("/")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const hasRole = (role: string) => {
    return user?.role === role
  }

  const isAdmin = hasRole("ADMIN") || hasRole("SUPER_ADMIN")

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    hasRole,
    login,
    logout,
  }
}