// app/(Auth)/components/LogOut.tsx
'use client'

import { useActionState, useState, useCallback, useEffect, useRef, useImperativeHandle, Ref } from "react"
import Captcha_CMP, { CaptchaHandler } from "@/app/components/(captchCMP)/CaptchaCMP"
import { useRouter } from "next/navigation"
import FlyoutLayout from "@/app/components/(Flyouts)/FlyoutLayout"
import { flyoutPageEnum, useFlyoutPage } from "@/app/components/(Flyouts)/(Provider)/FlyoutPageContextProvider"
import { logoutAction, LogOutState } from "./action/logOutAction"


export interface LogOutHandlerRef {
  openMe:()=>void,
  closeMe:()=>void,
  ToggleShow:()=>void
}

export default function LogOut({ ref }: { ref?: Ref<LogOutHandlerRef> }) {
  const { user, setUser ,CloseMe_and_Open } = useFlyoutPage()
  const [isOpen, setIsOpen] = useState(false)
 

  useImperativeHandle(ref, () => ({
    openMe: () => { setIsOpen(true) },
    closeMe: () => { setIsOpen(false) },
    ToggleShow: () => { setIsOpen(!isOpen) }
  }))

  const [captchaId, setCaptchaId] = useState("")
  const [userCaptchaInput, setUserCaptchaInput] = useState("")
  const handleCapchCMP_methodes = useRef<CaptchaHandler>(null)
  const [state, formAction, isPending] = useActionState<LogOutState | null, FormData>(
    logoutAction, // ✅ استفاده از تابع درست
    null
  )

  const handleCaptchaIdChange = useCallback((id: string) => {
    setCaptchaId(id)
  }, [])

  const handleUserCaptchaInput = useCallback((input: string) => {
    setUserCaptchaInput(input)
  }, [])

  const router = useRouter()

  useEffect(() => {
    if (state?.success === true) {
      // ✅ پاک کردن اطلاعات کاربر از Context
      setUser(null)
      
      // رفرش صفحه برای به‌روزرسانی کامپوننت‌ها
      router.refresh()
      
      // بستن پنجره خروج
      setIsOpen(false)
    }
  }, [state, router, setUser])

  return (
    <>
      <FlyoutLayout onCloseMe={() => { setIsOpen(!isOpen) }} isOpen={isOpen}>
        <div id="content" className="flex flex-col w-full h-full items-center gap-2">
          {/* بخش ویرایش پروفایل */}
          <div className="flex w-full justify-around items-center relative shrink-0">
            <h4>ویرایش پروفایل کاربری</h4>
          </div>
          <hr className="w-[99%] text-gray-200 shrink-0" />
          
          <div className="flex flex-col items-center landscape:w-xs portrait:w-full text-slate-800 gap-2">
            <div className="flex flex-col landscape:w-xs portrait:w-full min-h-0 items-center">
              <div className="text-sm">
                <label htmlFor="">کاربر :</label>
                <span>{user?.name + " " + user?.family}</span>
              </div>

              <div className="flex w-[95%] sm:w-[85%] gap-2 mt-1 text-sm">
                <button 
                  type="button" 
                  className="block bg-sky-600 hover:bg-sky-700 cursor-pointer text-white w-full rounded-md px-3 pt-2 pb-2 text-center outline-0"
                  onClick={() => {
                    CloseMe_and_Open(flyoutPageEnum.profile);
                  }}
                >
                  ویرایش پروفایل
                </button>
              </div>
            </div>
          </div>

          {/* بخش خروج از سایت */}
          <div className="flex w-full justify-around items-center relative shrink-0 mt-10">
            <h4>خروج از سایت</h4>
          </div>
          <hr className="w-[99%] text-gray-200 shrink-0" />

          <form action={formAction} className="flex flex-col items-center landscape:w-xs portrait:w-full text-slate-800 gap-2">
            {/* نمایش اطلاعات کاربر برای خروج */}
            <div className="flex flex-col w-[95%] sm:w-[85%] gap-1 mt-2">
              <div className="flex w-full justify-center">
                <span className="text-sm text-gray-600">
                  آیا می‌خواهید از حساب کاربری خود خارج شوید؟
                </span>
              </div>
            </div>

            {/* captcha */}
            <div className="flex flex-col w-[95%] sm:w-[85%] gap-1 mt-2">
              <div className="flex w-full">
                <label className="text-right text-[10px] pr-2">کد امنیتی :</label>
                {state?.errors?.userCaptcha && (
                  <label className="text-right text-[10px] pr-2 text-red-600">
                    {state?.errors?.userCaptcha}
                  </label>
                )}
              </div>

              <input type="hidden" name="captchaId" value={captchaId} />
              <input type="hidden" name="userCaptchaInput" value={userCaptchaInput} />
              <Captcha_CMP
                className="w-full flex gap-1"
                ref={handleCapchCMP_methodes}
                onCaptchaIdChange={handleCaptchaIdChange}
                onCaptchaUserInputChange={handleUserCaptchaInput}
              />
            </div>

            {/* message place */}
            <div className="flex py-1 mt-4">
              {state?.errors?.message && (
                <pre className="w-full text-red-700 text-[10px] text-right">
                  {state.errors?.message}
                </pre>
              )}
            </div>

            {/* submit button */}
            <div className="flex w-[95%] sm:w-[85%] gap-2 mt-1 text-sm">
              <button
                type="submit"
                className="block bg-red-600 hover:bg-red-700 cursor-pointer text-white w-full rounded-md px-3 pt-2 pb-2 text-center outline-0 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "در حال خروج . . ." : "خروج از سایت"}
              </button>
            </div>

           
          </form>
        </div>
      </FlyoutLayout>
    </>
  )
}