// app/(Auth)/components/LogIn.tsx
'use client'

import { useActionState, useState, useEffect, useRef, useImperativeHandle, Ref } from "react"
import { loginAction, LoginState } from "./action/loginAction"
import { useRouter } from "next/navigation"
import FlyoutLayout from "@/app/components/(Flyouts)/FlyoutLayout"
import { flyoutPageEnum, useFlyoutPage } from "@/app/components/(Flyouts)/(Provider)/FlyoutPageContextProvider"
import CaptchaCMP, { CaptchaHandler } from "@/app/components/(captcha)/Captcha_CMP"
import Captcha_InputCMP from "@/app/components/(captcha)/captcha_Input_CMP"
import SplitInput from "@/app/components/(captcha)/Split_InputCMP"

export interface LoginHandlerRef {
  openMe: () => void,
  closeMe: () => void,
  ToggleShow: () => void
}

export default function LogIn({ ref }: { ref?: Ref<LoginHandlerRef> }) {

  const { CloseMe_and_Open } = useFlyoutPage()
  const { setUser } = useFlyoutPage()
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    openMe: () => { setIsOpen(true) },
    closeMe: () => { setIsOpen(false) },
    ToggleShow: () => { setIsOpen(!isOpen) }
  }))

  const captchaRef = useRef<CaptchaHandler>(null)
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, null)

  const router = useRouter()
  useEffect(() => {
    if (state?.success === true && state.user) {
      setUser(state.user)
      router.refresh()
      setIsOpen(false)
    }
  }, [state, router, setUser])

  useEffect(() => {
    if (state?.success === false && state?.errors?.userCaptcha) {
      captchaRef.current?.clear()
    }
  }, [state])

  const closeMe=()=>{
    
    setIsOpen(!isOpen);
    
  }

  return (
    <>
    <FlyoutLayout onCloseMe={closeMe} isOpen={isOpen}>
              <div id="content" className="flex flex-col w-full h-full  items-center gap-2 portrait:px-3 ">
                  <div className="flex w-full  justify-around items-center relative shrink-0">
                      <h4>فرم ورود کاربران</h4>
                  </div>

                  <hr className="w-[99%] text-gray-200 shrink-0" />
                  
                  <div id="form" className="flex flex-col w-full flex-1 min-h-0 items-center overflow-y-auto ">
                        <form action={formAction} className="flex flex-col   items-center landscape:w-xs portrait:w-full text-slate-800 gap-2">
                          {/* userName ----------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">نام کاربری :</label>
                                  {state?.errors?.userName && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.userName}</label>
                                  )}
                              </div>
                              <input id="userName" name="userName" type="text" placeholder="UserName" dir="ltr"
                                  required autoFocus defaultValue={state?.values?.userName || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>
                          {/* passWord ------------ */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">گذر واژه :</label>
                                  {state?.errors?.passWord && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.passWord}</label>
                                  )}
                              </div>
                              <input id="password" name="password" type="password" autoComplete="current-password" placeholder="PassWord" dir="ltr"
                                  required
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>
                          {/* captcha ---------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1 mt-2">
                              <div className="flex w-full">
                                  <label className="text-right text-[10px] pr-2">کد امنیتی :</label>
                                  {state?.errors?.userCaptcha && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.userCaptcha}</label>
                                  )}
                              </div>

                              <div className="flex flex-col w-full gap-2">
                                  <CaptchaCMP className="w-full flex" name="captchaId" ref={captchaRef} />
                                  {/* <Captcha_InputCMP name="userCaptchaInput" /> */}
                                  <SplitInput name="userCaptchaInput"/>
                              </div>

                          </div>
                                   
                          {/* message place ---------- */}
                          <div className="flex py-1 mt-4">
                              {state?.errors?.message && (
                                  <pre className="w-full text-red-700 text-[10px] text-right">
                                      {state.errors?.message}
                                  </pre>
                              )}
                          </div>
                          {/* submit button ---------- */}
                          <div className="flex w-[95%] sm:w-[85%] gap-2 mt-1 text-sm">
                              <button
                                  type="submit"
                                  className="block bg-sky-600 text-white w-full rounded-md px-3 pt-2 pb-2 text-center outline-0 disabled:opacity-50"
                                  disabled={isPending}
                              >
                                  {isPending ? "ورود به حساب کاربری . . ." : "ورود به حساب کاربری"}
                              </button>
                          </div>

                          {/* register button ---------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-2 mt-2 justify-center">
                              <p className="w-full mt-5 text-center text-sm/6">
                                  عضو سایت نیستید ؟{' '}
                                  <button
                                      type="button"
                                      className="text-sm font-extrabold text-sky-600 hover:text-sky-400 hover:cursor-pointer"
                                    onClick={()=>{ CloseMe_and_Open(flyoutPageEnum.register) }}
                                  >
                                      ثبت نام
                                  </button>
                              </p>
                          </div>


                      </form>
                  </div>

              </div>
   </FlyoutLayout>
  
   </>
  )
}