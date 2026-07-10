// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { decryptSession, encryptSession,  updateSession } from '@/app/(Auth)/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/store', '/storeProfile', '/storeActivation', '/productsList','/users']
const publicRoutes = ['/',]

const AdminPathes = ["/newsAgenciesList"]

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(route + '/'))
  const isPublicRoute = publicRoutes.includes(path)
  
  console.log(' *  > proxy :  path :', path)
  
  // فقط برای مسیرهایی که نیاز به بررسی سشن دارند
  if (isPublicRoute || isProtectedRoute) {
    try {
      const cookie = (await cookies()).get('session')?.value
      const session = await decryptSession(cookie)

      // 4. Redirect unauthenticated users from protected routes
      if (isProtectedRoute && !session?.userId) {
        console.log(" *  > proxy : Redirect unauthenticated user to home")
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

      // 5. Update session only if user is authenticated
      // if (session?.userId) {
      //   const updateResponse = await updateSession()
      //   if (updateResponse) {
      //     console.log(" *  > proxy : Session updated successfully")
      //     return updateResponse // مهم: response برمی‌گرداند
      //   }
      // }

      
      
    } catch (error) {
      console.error("Session error:", error)
      // در صورت خطا در سشن، کاربر را به خانه بفرست
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }
    }
  }

  console.log(" *  > proxy :  No session update needed")
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}