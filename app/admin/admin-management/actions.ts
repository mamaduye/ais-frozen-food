"use server"

import { revalidatePath } from "next/cache"

import { requireSuperAdmin } from "@/lib/supabase/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export type CreateAdminResult = {
  success: boolean
  message: string
}

export async function createAdminAction(
  formData: FormData,
): Promise<CreateAdminResult> {
  // ============================================================
  // 1. SECURITY
  // ============================================================
  // Jangan percaya tombol yang disembunyikan di frontend.
  // Server tetap memastikan pemanggil adalah Super Admin.
  await requireSuperAdmin()

  // ============================================================
  // 2. GET & NORMALIZE FORM DATA
  // ============================================================
  const fullName = String(
    formData.get("full_name") ?? "",
  ).trim()

  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase()

  const phone = String(
    formData.get("phone") ?? "",
  ).trim()

  const password = String(
    formData.get("password") ?? "",
  )

  

  // ============================================================
  // 3. BASIC VALIDATION
  // ============================================================
  if (!fullName) {
    return {
      success: false,
      message: "Nama administrator wajib diisi.",
    }
  }

  if (!email) {
    return {
      success: false,
      message: "Email administrator wajib diisi.",
    }
  }

  if (!email.includes("@")) {
    return {
      success: false,
      message: "Format email tidak valid.",
    }
  }

  if (!phone) {
    return {
      success: false,
      message: "Nomor WhatsApp wajib diisi.",
    }
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password minimal 8 karakter.",
    }
  }

  // ============================================================
  // 4. CREATE PRIVILEGED SUPABASE CLIENT
  // ============================================================
  const supabaseAdmin = createAdminClient()

  // ============================================================
  // 5. CREATE AUTH USER
  // ============================================================
  const {
    data: authData,
    error: authError,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,

    // Karena akun dibuat langsung oleh Super Admin,
    // admin tidak perlu melakukan konfirmasi email terlebih dahulu.
    email_confirm: true,

    user_metadata: {
      full_name: fullName,
      phone,
    },
  })

  if (authError || !authData.user) {
    console.error(
      "CREATE ADMIN AUTH ERROR:",
      authError,
    )

    let message =
      authError?.message ??
      "Gagal membuat akun administrator."

    const normalizedMessage =
      message.toLowerCase()

    if (
      normalizedMessage.includes(
        "already been registered",
      ) ||
      normalizedMessage.includes(
        "already registered",
      ) ||
      normalizedMessage.includes(
        "already exists",
      )
    ) {
      message =
        "Email tersebut sudah digunakan oleh akun lain."
    }

    if (
      normalizedMessage.includes("password")
    ) {
      message =
        "Password tidak memenuhi ketentuan keamanan."
    }

    return {
      success: false,
      message,
    }
  }

  const createdUserId = authData.user.id

  // ============================================================
  // 6. UPDATE PROFILE CREATED BY DATABASE TRIGGER
  // ============================================================
  // Trigger handle_new_user() otomatis membuat:
  //
  // role = customer
  //
  // Di sini baru kita promosikan akun tersebut menjadi admin.
  const {
    error: profileError,
  } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      email,
      role: "admin",
    })
    .eq("id", createdUserId)

  // ============================================================
  // 7. ROLLBACK IF PROFILE UPDATE FAILS
  // ============================================================
  // Kalau Auth berhasil dibuat tetapi profile gagal diubah,
  // jangan tinggalkan akun setengah jadi.
  if (profileError) {
    console.error(
      "CREATE ADMIN PROFILE ERROR:",
      profileError,
    )

    const {
      error: rollbackError,
    } =
      await supabaseAdmin.auth.admin.deleteUser(
        createdUserId,
      )

    if (rollbackError) {
      console.error(
        "CREATE ADMIN ROLLBACK ERROR:",
        rollbackError,
      )
    }

    return {
      success: false,
      message:
        "Akun gagal disiapkan sebagai administrator. Perubahan dibatalkan.",
    }
  }

  // ============================================================
  // 8. REFRESH ADMIN MANAGEMENT
  // ============================================================
  revalidatePath(
    "/admin/admin-management",
  )

  return {
    success: true,
    message: `${fullName} berhasil ditambahkan sebagai Admin.`,
  }
}

export async function promoteCustomerAction(
  userId: string,
): Promise<CreateAdminResult> {
  await requireSuperAdmin()

  if (!userId) {
    return {
      success: false,
      message: "Pengguna tidak valid.",
    }
  }

  const supabaseAdmin = createAdminClient()

  // Pastikan target memang customer.
  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    console.error(
      "PROMOTE CUSTOMER GET PROFILE ERROR:",
      profileError,
    )

    return {
      success: false,
      message: "Data pelanggan tidak ditemukan.",
    }
  }

  if (profile.role !== "customer") {
    return {
      success: false,
      message:
        "Akun tersebut bukan pelanggan atau sudah memiliki akses administrator.",
    }
  }

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("profiles")
    .update({
      role: "admin",
    })
    .eq("id", userId)
    .eq("role", "customer")

  if (updateError) {
    console.error(
      "PROMOTE CUSTOMER ERROR:",
      updateError,
    )

    return {
      success: false,
      message:
        "Gagal memberikan akses Admin kepada pelanggan.",
    }
  }

  revalidatePath("/admin/admin-management")
  revalidatePath("/admin/users")

  return {
    success: true,
    message: `${
      profile.full_name ?? profile.email ?? "Pengguna"
    } berhasil dipromosikan menjadi Admin.`,
  }
}

export async function demoteAdminAction(
  userId: string,
): Promise<CreateAdminResult> {
  await requireSuperAdmin()

  if (!userId) {
    return {
      success: false,
      message: "Administrator tidak valid.",
    }
  }

  // ------------------------------------------------------------
  // Cari user yang sedang login.
  // Ini proteksi tambahan agar akun aktif tidak menurunkan dirinya.
  // ------------------------------------------------------------
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  if (!currentUser) {
    return {
      success: false,
      message: "Sesi pengguna tidak ditemukan.",
    }
  }

  if (currentUser.id === userId) {
    return {
      success: false,
      message:
        "Anda tidak dapat menurunkan role akun Anda sendiri.",
    }
  }

  const supabaseAdmin = createAdminClient()

  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    console.error(
      "DEMOTE ADMIN GET PROFILE ERROR:",
      profileError,
    )

    return {
      success: false,
      message: "Data administrator tidak ditemukan.",
    }
  }

  // Sengaja hanya admin biasa.
  // super_admin tidak boleh diturunkan lewat action ini.
  if (profile.role !== "admin") {
    return {
      success: false,
      message:
        "Hanya akun dengan role Admin yang dapat diturunkan menjadi pelanggan.",
    }
  }

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("profiles")
    .update({
      role: "customer",
    })
    .eq("id", userId)
    .eq("role", "admin")

  if (updateError) {
    console.error(
      "DEMOTE ADMIN ERROR:",
      updateError,
    )

    return {
      success: false,
      message:
        "Gagal mencabut akses administrator.",
    }
  }

  revalidatePath("/admin/admin-management")
  revalidatePath("/admin/users")

  return {
    success: true,
    message: `${
      profile.full_name ?? profile.email ?? "Administrator"
    } sekarang menjadi Customer.`,
  }
}