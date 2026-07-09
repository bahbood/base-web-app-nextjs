// app/(Auth)/actions/loginAction.ts
'use server'

import { db , } from '@/app/db'
import { eq } from 'drizzle-orm'
import { users } from '@/app/db/schema'
import { createSession } from '../../lib/session'
import { logined_User_Info } from '@/app/components/(Flyouts)/(Provider)/FlyoutPageContextProvider'
import bcrypt from 'bcryptjs'
import captchaValidationAction from '@/app/components/(captcha)/action/captchaValidationAction'



export type LoginState = {
  success: boolean
  user?: logined_User_Info | null
  errors?:{
    userName?:string
    passWord?:string
    userCaptcha?:string
    message?:string
 }
  values?:{
    userName:string
    
 }
 } | null

 

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // 1. دریافت داده‌های فرم
  const userName = formData.get('userName') as string
  const password = formData.get('password') as string
  const captchaId = formData.get('captchaId') as string
  const userCaptchaInput = formData.get('userCaptchaInput') as string

 

  
  // 2. اعتبارسنجی اولیه

  const userName_validation: boolean =  /^[a-zA-Z0-9@#$%^&]{1,20}$/.test(userName)
  const password_validation: boolean =  /^[a-zA-Z0-9@#$%^&]{6,20}$/.test(password)
  const userCaptchaInput_validation: boolean =/^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789]{5}$/.test(userCaptchaInput)

  if (!userName_validation || !password_validation || !captchaId || !userCaptchaInput_validation) {
    
    // console.log(formData)
    // console.log(" u: "+userName_validation.toString() +" p: " +password_validation.toString() + " capId : "+ captchaId +" Cap_in: " +userCaptchaInput_validation.toString() +" ")

    return {
        success: false,
        errors:{
        userName : userName_validation ? undefined : "نام کاربری بدرستی وارد نشده"  ,
        passWord : password_validation ? undefined : "گذرواژه  بدرستی وارد نشده"  ,
        userCaptcha  : userCaptchaInput_validation ? undefined : "کد امنیتی  بدرستی وارد نشده"  , 
        message:"مقادیر درخواستی بدرستی وارد نشده اند"
        },
       values:{ 
        userName:userName,
       }
     }

  }
 
  // 3. اعتبارسنجی کد امنیتی 
  const captchaResult = await captchaValidationAction(captchaId, userCaptchaInput);
 
  if ( !captchaResult ) { 
    return {
        success: false,
        errors:{
        userName :  undefined ,
        passWord :  undefined ,
        userCaptcha  : "کد امنیتی بدرستی وارد نشده"  ,
        },
        values:{ 
        userName:userName,
       }
     }
  }

 // 4 . لاگین


  try {
    // 5. 
    // جستجوی کاربر در دیتابیس
    const user = await db
      .select()
      .from(users)
      .where(eq(users.user_name, userName))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        errors: { message: '  !!! نام کاربری یا گذرواژه  اشتباه است  ' },
        values:{ 
        userName:userName,
       }
      };
    }

      const foundUser = user[0]
    // ********** بررسی رمز عبور **********
    const passwordMatch = await bcrypt.compare(password, foundUser.password)
    if (!passwordMatch) {
      return {
       
          success: false,
          errors: { message: '  !!! نام کاربری یا گذرواژه  اشتباه است  ' },
          values: { userName }
        };
      }


    // ساخت کوکی و ارسال به مرورگر
    const sessionResult=await createSession( foundUser.id , foundUser.user_name ,foundUser.role as string , foundUser.is_active as boolean 
      ,foundUser.name as string,foundUser.family as string,foundUser.avatar as string
      ,foundUser.mobile_number as string,foundUser.email as string);

    if( !sessionResult ){
       return {
          success: false,
          errors:{
          message: ' !!! خطایی در پروسه ورود کاربر ایجاد شده  ',
          },
           values:{ 
           userName:userName,
       }
        };
    }



    return {
        success: true,
        user:sessionResult.user || null
      };

   
    
  } catch (error) {
    console.error('Login error:', error)
    return {
        success: false,
        errors:{
        message:'خطا در ارتباط با سرور - دوباره سعی نمایید!!!' 
        },
        values:{ 
        userName:userName,
       }
      }
  }


}


