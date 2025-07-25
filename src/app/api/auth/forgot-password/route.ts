import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { forgotPasswordSchema } from "@/lib/validations"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return NextResponse.json(
        { message: "Si el email existe, recibirás un enlace de recuperación" }
      )
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Guardar token en base de datos
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: resetToken,
        expires: resetTokenExpiry
      }
    })

    // TODO: Enviar email con el token
    // await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({
      message: "Si el email existe, recibirás un enlace de recuperación"
    })

  } catch (error: any) {
    console.error("Error en forgot password:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}