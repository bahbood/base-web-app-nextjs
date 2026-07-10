import { redirect } from 'next/navigation'
import { checkRoleAuthorisation } from '@/app/(Auth)/lib/session'
import AddUserForm from './AddUserForm'

export default async function AddUserPage() {
  const isAdmin = await checkRoleAuthorisation(['admin'])
  if (!isAdmin) redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/users" className="text-sm text-gray-500 hover:text-gray-700">بازگشت</a>
          <h2 className="text-sm font-bold text-gray-700">افزودن کاربر</h2>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AddUserForm />
      </main>
    </div>
  )
}
