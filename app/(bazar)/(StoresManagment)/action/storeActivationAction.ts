'use server'

import captchaValidationAction from '@/app/components/(captcha)/action/captchaValidationAction'
import { db } from '@/app/db'
import { stores } from '@/app/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { decryptSession } from '@/app/(Auth)/lib/session'

export type StoreActivationState = {
  success: boolean
  errors?: {
    userCaptcha?: string
    message?: string
  }
} | null

export async function storeActivationAction(prevState: StoreActivationState, formData: FormData): Promise<StoreActivationState> {
  const captchaId = formData.get('captchaId') as string
  const userCaptchaInput = formData.get('userCaptchaInput') as string

  if (!captchaId || !userCaptchaInput) {
    return { success: false, errors: { userCaptcha: 'کد امنیتی وارد نشده' } }
  }

  const captchaResult = await captchaValidationAction(captchaId, userCaptchaInput)
  if (!captchaResult) {
    return { success: false, errors: { userCaptcha: 'کد امنیتی بدرستی وارد نشده' } }
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) {
    return { success: false, errors: { message: 'کاربر وارد سیستم نیست' } }
  }

  const payload = await decryptSession(sessionCookie)
  if (!payload) {
    return { success: false, errors: { message: 'نشست نامعتبر' } }
  }

  const userId = Number(payload.userId)

  try {
    const existingStore = await db
      .select()
      .from(stores)
      .where(eq(stores.user_id, userId))
      .limit(1)

    if (existingStore.length === 0) {
      return { success: false, errors: { message: 'فروشگاهی برای این کاربر یافت نشد' } }
    }

    const store = existingStore[0]
    const now = new Date()
    const expiredAt = store.expired_at ? new Date(store.expired_at) : now
    const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

    const newExpiredAt = expiredAt > now ? new Date(expiredAt.getFullYear() + 1, expiredAt.getMonth(), expiredAt.getDate()) : oneYearFromNow

    await db.update(stores).set({
      on_air: true,
      expired_at: newExpiredAt,
    }).where(eq(stores.id, store.id))

    return { success: true }
  } catch (error) {
    console.error('Store activation error:', error)
    return { success: false, errors: { message: 'خطا در ارتباط با سرور' } }
  }
}
