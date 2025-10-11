import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Delete user and all associated data (cascade deletes sites, pageviews, events, accounts, sessions)
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}

