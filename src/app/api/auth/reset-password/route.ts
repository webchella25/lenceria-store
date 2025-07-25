import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { resetPasswordSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = resetPasswordSchema.parse(body)

    // Verificar token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: validatedData.token }
    })

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Eliminar token usado
    await prisma.verificationToken.delete({
      where: { token: validatedData.token }
    })

    return NextResponse.json({
      message: "Contraseña actualizada exitosamente"
    })

  } catch (error: any) {
    console.error("Error en reset password:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}