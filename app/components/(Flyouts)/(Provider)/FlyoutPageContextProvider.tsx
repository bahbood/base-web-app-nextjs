// app/lib/FlyoutPageContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useRef } from 'react'
import RegisterSW from '../../../lib/serviceWorker'
import SideMenu, { SideMenuHandlerRef } from '../SideMenu'
import LogIn, { LoginHandlerRef } from '@/app/(Auth)/components/LogIn'
import LogOut, { LogOutHandlerRef } from '@/app/(Auth)/components/LogOut'
import Register, { RegisterHandlerRef } from '@/app/(Auth)/components/Register'
import Profile, { ProfileHandlerRef } from '@/app/(Auth)/components/Profile'

type MessageBoxState = {
    show: boolean
    caption: string
    message: string

    type?: "info" | "success" | "warning" | "error"
}

// FlyoutPageContextType **************************************************************************
interface I_FlyoutPageProviderContext{
  CloseMe_and_Open:(replacePage : flyoutPageEnum)=>void 
  sideMenu_toggleShow:()=>void
  logInPage_toggleShow:()=>void
  logOutPage_toggleShow:()=>void
  ProfilePage_toggleShow:()=>void
  RegisterPage_toggleShow:()=>void

   messageBox_show(
    caption: string,
    message: string,
    type?: MessageBoxState["type"]
): void

    messageBox_close: () => void

    messageBox: MessageBoxState

  user: logined_User_Info | null;
  setUser: (user: logined_User_Info | null) => void;
}
  // تعریف نوع کاربر
export type logined_User_Info = {
  name?: string;
  family?: string;
  avatar?: string;
  mobile?: string;
  email?: string;
};

export enum flyoutPageEnum{ login,logout,register,profile,sideMenu }

const FlyoutPageContext = createContext<I_FlyoutPageProviderContext | undefined >(undefined)

// FlyoutPageProvider **************************************************************************
/** پرووایدر منوی شناور برای صفحات احراز هویت و منوی چپ به راست نرم افزار */
export function FlyoutPageProvider({ children , initialUser = null }: { children: ReactNode ,initialUser?: logined_User_Info | null} ) {
  //
   const [user, setUser] = useState<logined_User_Info | null>(initialUser);

   const [messageBox, setMessageBox] = useState<MessageBoxState>({
    show: false,
    caption: "",
    message: ""
})

   const SideMenuHandler= useRef<SideMenuHandlerRef>(null)
   const LogInHandler= useRef<LoginHandlerRef>(null)
  const LogOutHandler= useRef<LogOutHandlerRef>(null)
  const RegisterHandler=useRef<RegisterHandlerRef>(null)
  const ProfileHandler=useRef<ProfileHandlerRef>(null)

  const closeAllForm=()=>{
                  SideMenuHandler.current?.closeMe();
                  LogInHandler.current?.closeMe();
                  LogOutHandler.current?.closeMe();
                  ProfileHandler.current?.closeMe();
                  RegisterHandler.current?.closeMe();
                  messageBox_close();
  }

 const messageBox_show = (
    caption: string,
    message: string,
    type: MessageBoxState["type"] = "info"
) => {

    setMessageBox({
        show: true,
        caption,
        message,
        type
    })

}

const messageBox_close = () => {

    setMessageBox({
        show: false,
        caption: "",
        message: "",
        type: "info"
    })

}

  const CloseMe_and_Open=(replacePage : flyoutPageEnum)=>{
    closeAllForm();
  setTimeout(() => {
    switch (replacePage) {
    case flyoutPageEnum.login:
         LogInHandler.current?.ToggleShow()
      break;
      case flyoutPageEnum.logout:
        LogOutHandler.current?.ToggleShow()
      break;
      case flyoutPageEnum.register:
        RegisterHandler.current?.ToggleShow()
      break;
      case flyoutPageEnum.profile:
        ProfileHandler.current?.ToggleShow()
      break;
      case flyoutPageEnum.sideMenu:
        SideMenuHandler.current?.ToggleShow()
      break;
  
   }

   },1000)
  }

  return (
    <FlyoutPageContext.Provider 
            value={
              { 
                CloseMe_and_Open: (replacePage : flyoutPageEnum)=>{ CloseMe_and_Open(replacePage);}
                ,
                sideMenu_toggleShow : ()=>{ closeAllForm();  SideMenuHandler.current?.ToggleShow() }
                ,
                logInPage_toggleShow :()=>{ closeAllForm(); LogInHandler.current?.ToggleShow()}
                ,
                logOutPage_toggleShow :()=>{ closeAllForm(); LogOutHandler.current?.ToggleShow()}
                ,
                ProfilePage_toggleShow :()=>{ closeAllForm(); ProfileHandler.current?.ToggleShow() }
                ,
                RegisterPage_toggleShow :()=>{ closeAllForm(); RegisterHandler.current?.ToggleShow() }
                ,

messageBox,
messageBox_show,
messageBox_close

                ,
                user
                ,
                setUser
              }
             
            }>
       <RegisterSW/>
        {/* فرم ها و برگ های پرنده       */}
       <SideMenu ref={SideMenuHandler}/>
       <LogIn  ref={LogInHandler} />
       <LogOut ref={LogOutHandler} />
       <Profile ref={ProfileHandler} />
       <Register  ref={RegisterHandler} />



      {children}

    </FlyoutPageContext.Provider>
  )
}

// useFlyoutPage **************************************************************************
/** FlyoutPageContext هوک برای دسترسی به کانتکس های ارائه شده منوی شناور  */
export function useFlyoutPage() {
  const context = useContext(FlyoutPageContext)
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider')
  }
  return context
}



