// app/(Auth)/components/action/RegisterAction.ts


'use server'

import captchaValidationAction from '@/app/components/(captcha)/action/captchaValidationAction'
import { db , } from '@/app/db'
import { eq } from 'drizzle-orm'
import { users } from '@/app/db/schema'
import bcrypt from 'bcryptjs'

export type RegisterState = {
  success: boolean
 
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


 
 export async function RegisterAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
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
 
  // 4. بررسی تکراری نبودن نام کاربری و ذخیره در دیتابیس


   try {
     // 5. جستجوی کاربر در دیتابیس
     const existingUser = await db
       .select()
       .from(users)
       .where(eq(users.user_name, userName))
       .limit(1);
 
     if (existingUser.length > 0) {
       return {
         success: false,
         errors: { message: 'نام کاربری تکراری است' },
         values:{ 
         userName:userName,
        }
       };
     }
 
     // 6. هش کردن رمز عبور
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // 7. درج کاربر جدید در دیتابیس
     await db.insert(users).values({
       user_name: userName,
       password: hashedPassword,
       role: 'user',
       is_active: true,
     });
 
     return {
         success: true,
       };
 
   } catch (error) {
     console.error('Register error:', error)
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
