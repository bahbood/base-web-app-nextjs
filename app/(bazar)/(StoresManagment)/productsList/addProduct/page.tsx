import { cookies } from 'next/headers'
import { decryptSession } from '@/app/(Auth)/lib/session'
import { getStoreByUserId } from '../../../lib/getStoreByUserId'
import { redirect } from 'next/navigation'
import AddProductForm from './AddProductForm'

async function checkAccess() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  if (!sessionCookie) return false

  const payload = await decryptSession(sessionCookie)
  if (!payload) return false

  const store = await getStoreByUserId(Number(payload.userId))
  return !!store
}

export default async function AddProductPage() {
  const hasAccess = await checkAccess()
  if (!hasAccess) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/productsList" className="text-sm text-gray-500 hover:text-gray-700">بازگشت</a>
          <h2 className="text-sm font-bold text-gray-700">افزودن محصول</h2>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AddProductForm />
      </main>
    </div>
  )
}
