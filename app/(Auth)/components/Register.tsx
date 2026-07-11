// app/(Auth)/components/Register.tsx
'use client'

import FlyoutLayout from "@/app/components/(Flyouts)/FlyoutLayout";
import { Ref, useActionState, useEffect, useImperativeHandle, useRef, useState } from "react";
import {  RegisterState ,RegisterAction } from "./action/Register";
import { flyoutPageEnum, useFlyoutPage } from "@/app/components/(Flyouts)/(Provider)/FlyoutPageContextProvider";
import CaptchaCMP, { CaptchaHandler } from "@/app/components/(captcha)/Captcha_CMP";
import Captcha_InputCMP from "@/app/components/(captcha)/captcha_Input_CMP";

export interface RegisterHandlerRef{
 openMe:()=>void,
  closeMe:()=>void,
  ToggleShow:()=>void
}

export default function Register({ref }: {ref?:Ref<RegisterHandlerRef>}){
    const { CloseMe_and_Open, messageBox_show } = useFlyoutPage()
        const[isOpen , setIsOpen]=useState(false)
      
        useImperativeHandle(ref , ()=>({
          openMe :()=>{setIsOpen(true)},
          closeMe :()=>{setIsOpen(false)},
          ToggleShow:()=>{ setIsOpen(!isOpen) }
        }))

       const captchaRef = useRef<CaptchaHandler>(null)
        
     const closeMe=()=>{
    
    setIsOpen(!isOpen);
    
  }

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>( RegisterAction, null )

  useEffect(() => {
    if (state?.success === false && state?.errors?.userCaptcha) {
      captchaRef.current?.clear()
    }
  }, [state])

  const messageBoxShowRef = useRef(messageBox_show)
  useEffect(() => {
    messageBoxShowRef.current = messageBox_show
  })

  useEffect(() => {
    if (state?.success === true) {
      messageBoxShowRef.current("ثبت نام", "ثبت نام با موفقیت انجام شد. لطفا وارد شوید.", "success")
    } else if (state?.success === false && state?.errors?.message) {
      messageBoxShowRef.current("خطا", state.errors.message, "error")
    }
  }, [state])

    return(
          <FlyoutLayout onCloseMe={closeMe} isOpen={isOpen}>
                      <div id="content" className="flex flex-col w-full h-full  items-center gap-2 portrait:px-3 ">
                          <div className="flex w-full  justify-around items-center relative shrink-0">
                              <h4>فرم ثبت نام کاربران</h4>
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
                                          pattern="^[a-zA-Z0-9_]{5,50}$"
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
                                          pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&])[a-zA-Z0-9@#$%^&]{5,}$/"
                                        //   پترن پسورود حداقل 5 حرف حتما 	حداقل شامل  1 حرف کوچک -- حداقل 1 حرف بزرگ و  حداقل یک نشانه از @#$%^& باشد
                                      />
                                  </div>

                                   {/* mobile number ----------- */}
                                  <div className="flex flex-col w-[95%] sm:w-[85%] gap-1">
                                      <div className="flex w-full ">
                                          <label className="text-right text-[10px] pr-2">  شماره موبایل : 09100000000 </label>
                                          {state?.errors?.userName && (
                                              <label className="text-right text-[10px] pr-2 text-red-600">{state?.errors?.userName}</label>
                                          )}
                                      </div>
                                      <input id="mobile_number" name="mobile_number" type="text" placeholder="mobile_number" dir="ltr"
                                          required  defaultValue={state?.values?.userName || ""}
                                          className="block w-full rounded-md px-3 pt-3 pb-2 text-xs outline-1 outline-gray-300"
                                          pattern="/^09[0-9]{9}$/"
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
                                  <Captcha_InputCMP name="userCaptchaInput" />
                              </div>

                          </div>
                                  {/* submit button ---------- */}
                                  <div className="flex w-[95%] sm:w-[85%] gap-2 mt-1 text-sm">
                                      <button
                                          type="submit"
                                          className="block bg-sky-600 text-white w-full rounded-md px-3 pt-2 pb-2 text-center outline-0 disabled:opacity-50"
                                          disabled={isPending}
                                      >
                                          {isPending ? "  ثبت مشخصات  . . ." : " ثبت مشخصات "}
                                      </button>
                                  </div>
        
                                  {/* register button ---------- */}
                                  <div className="flex flex-col w-[95%] sm:w-[85%] gap-2 mt-2 justify-center">
                                      <p className="w-full mt-5 text-center text-sm/6">
                                            قبلا در سایت ثبت نام کرده اید ؟{' '}
                                          <button
                                              type="button"
                                              className="text-sm font-extrabold text-sky-600 hover:text-sky-400 hover:cursor-pointer"
                                                onClick={()=>CloseMe_and_Open(flyoutPageEnum.login)}
                                          >
                                               ورود
                                          </button>
                                      </p>
                                  </div>
        
                              </form>
                          </div>
        
                      </div>
           </FlyoutLayout>
    )
}
