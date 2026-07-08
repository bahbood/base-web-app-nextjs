// app/(Auth)/components/Profile.tsx

'use client'

import { useActionState, useState, useCallback, useEffect, useRef,  useImperativeHandle, Ref } from "react"
import Captcha_CMP, { CaptchaHandler } from "@/app/components/(captchCMP)/CaptchaCMP"
import { useRouter } from "next/navigation"
import FlyoutLayout from "@/app/components/(Flyouts)/FlyoutLayout"
import { useFlyoutPage, logined_User_Info } from "@/app/components/(Flyouts)/(Provider)/FlyoutPageContextProvider"
import { ProfileAction, ProfileState } from "./action/profileAction"

export interface ProfileHandlerRef{
  openMe:()=>void,
  closeMe:()=>void,
  ToggleShow:()=>void
}


export default function Profile( {ref }: {ref?:Ref<ProfileHandlerRef>} ) {
//   const parentMethod=useContext(AuthContext )
  const { setUser, user } = useFlyoutPage()
    const[isOpen , setIsOpen]=useState(false)
  
    useImperativeHandle(ref , ()=>({
      openMe :()=>{setIsOpen(true)},
      closeMe :()=>{setIsOpen(false)},
      ToggleShow:()=>{ setIsOpen(!isOpen) }
    }))
  
  const [captchaId, setCaptchaId] = useState("")
  const [userCaptchaInput, setUserCaptchaInput] = useState("")
   const handleCapchCMP_methodes=useRef<CaptchaHandler>(null)

  
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>( ProfileAction, null )

  const handleCaptchaIdChange = useCallback((id: string) => {
    setCaptchaId(id)
  }, [])

  const handleUserCaptchaInput = useCallback((input: string) => {
    setUserCaptchaInput(input)
  }, [])

  
  const router = useRouter()
    useEffect(() => {
       if (state?.success === true) {
      if (state.user) setUser(state.user)
      router.refresh()
      setIsOpen(false)
        }

    }, [state, router, setUser])

     useEffect(() => {
       if ( state?.success === false && state?.errors?.userCaptcha) {
            handleCapchCMP_methodes.current?.clear()
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
                      <h4>فرم پروفایل </h4>
                  </div>

                  <hr className="w-[99%] text-gray-200 shrink-0" />
                  
                  <div id="form" className="flex flex-col w-full flex-1 min-h-0 items-center overflow-y-auto ">
                        <form action={formAction} className="flex flex-col   items-center landscape:w-xs portrait:w-full text-slate-800 gap-2">
                          {/* name ----------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">نام  :</label>
                                  {state?.errors?.name && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.name}</label>
                                  )}
                              </div>
                              <input id="name" name="name" type="text" placeholder="نام" dir="rtl"
                                  required autoFocus defaultValue={user?.name || state?.values?.name || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>
                          {/* family ----------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">نام خانوادگی  :</label>
                                  {state?.errors?.family && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.family}</label>
                                  )}
                              </div>
                              <input id="family" name="family" type="text" placeholder="نام خانوادگی" dir="rtl"
                                  required  defaultValue={user?.family || state?.values?.family || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>

                           {/* mobile ----------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">تلفن همراه:</label>
                                  {state?.errors?.mobile && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.mobile}</label>
                                  )}
                              </div>
                              <input id="mobile" name="mobile" type="text" placeholder="mobile" dir="ltr"
                                  required  defaultValue={user?.mobile || state?.values?.mobile || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>

                           {/* email ----------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2"> رایانامه ( ایمیل ):</label>
                                  {state?.errors?.email && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.email}</label>
                                  )}
                              </div>
                              <input id="email" name="email" type="text" placeholder="email" dir="ltr"
                                  required  defaultValue={user?.email || state?.values?.email || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div>

                           {/* avatar ----------- */}
                          {/* <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2"> شکلک ( آواتار ):</label>
                                  {state?.errors?.avatar && (
                                      <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.avatar}</label>
                                  )}
                              </div>
                              <input id="avatar" name="avatar" type="text" placeholder="avatar" dir="ltr"
                                  required  defaultValue={state?.values?.avatar || ""}
                                  className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                              />
                          </div> */}

                           
                         
                          {/* captcha ---------- */}
                          <div className="flex flex-col w-[95%] sm:w-[85%] gap-1 mt-2">
                              <div className="flex w-full ">
                                  <label className="text-right text-[10px] pr-2">کد امنیتی :</label>
                                  {state?.errors?.userCaptcha && (
                                    
                                      <label className="text-right text-[10px] pr-2 text-red-600"> {state?.errors?.userCaptcha}</label>
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
                                  {isPending ? "   در حال ذخیره . . ." : "ذخیره"}
                              </button>
                          </div>

                          {/* register button ---------- */}
                          {/* <div className="flex flex-col w-[95%] sm:w-[85%] gap-2 mt-2 justify-center">
                              <p className="w-full mt-5 text-center text-sm/6">
                                  عضو سایت نیستید ؟{' '}
                                  <button
                                      type="button"
                                      className="text-sm font-extrabold text-sky-600 hover:text-sky-400 hover:cursor-pointer"

                                  >
                                      ثبت نام
                                  </button>
                              </p>
                          </div> */}


                      </form>
                  </div>

              </div>
   </FlyoutLayout>
  
   </>
  )
}

