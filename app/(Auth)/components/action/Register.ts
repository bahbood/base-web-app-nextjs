// app/(Auth)/components/action/RegisterAction.ts
// حروف لاتین کوچک و بزرگ و اعداد و زیرخط و @#$%^& --- حداقل 5 و حداکثر 50 کاراکتر   --  نام کاربری
//  pattern="^[a-zA-Z0-9_@#$%^&]{5,50}$" 

 //پسوورد -- پترن پسورود حداقل 5 حرف حتما 	حداقل شامل  1 حرف کوچک -- حداقل 1 حرف بزرگ و  حداقل یک نشانه از @#$%^& باشد
//  pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&])[a-zA-Z0-9@#$%^&]{5,}$/"
// moblil_number    =>     pattern="/^09[0-9]{9}$/"

'use server'

import captchaValidationAction from '@/app/components/(captcha)/action/captchaValidationAction'
import { db , } from '@/app/db'
import { eq } from 'drizzle-orm'
import { users } from '@/app/db/schema'
import bcrypt from 'bcryptjs'

export type RegisterState = {
  success: boolean
 
  fieldsState?:{
    userName_isCorrect:boolean 
    passWord_isCorrect:boolean
    mobile_number_isCorrect:boolean
    userCaptcha_isCorrect:boolean
    userName_alreadyExist:boolean
    connection_isCorrect:boolean
 }
  values?:{
    userName:string
    mobile_number:string
 }
 } | null


 
 export async function RegisterAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
   // 1. دریافت داده‌های فرم
   const userName = formData.get('userName') as string
   const password = formData.get('password') as string
   const mobile_number = formData.get('mobile_number') as string
   const captchaId = formData.get('captchaId') as string
   const userCaptchaInput = formData.get('userCaptchaInput') as string
 
  
 
   
   // 2. اعتبارسنجی اولیه

   const userName_validation: boolean =  /^[a-zA-Z0-9_@#$%^&]{5,50}$/.test(userName)
   const mobile_validation: boolean =  /^09[0-9]{9}$/.test(mobile_number)
   const password_validation: boolean =  /^[a-zA-Z0-9@#$%^&]{6,20}$/.test(password)
   const userCaptchaInput_validation: boolean =/^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789]{5}$/.test(userCaptchaInput)
 
   if (!userName_validation || !mobile_validation || !password_validation || !captchaId || !userCaptchaInput_validation) {
     
     return {
         success: false,
         fieldsState:{
         userName_isCorrect : userName_validation   ,
         mobile_number_isCorrect: mobile_validation ,
         passWord_isCorrect : password_validation   ,
         userCaptcha_isCorrect  : userCaptchaInput_validation, 
         userName_alreadyExist: false,
         connection_isCorrect: true
         },
        values:{ 
         userName:userName,
         mobile_number:mobile_number
        }
      }
 
   }
  
   // 3. اعتبارسنجی کد امنیتی 
   const captchaResult = await captchaValidationAction(captchaId, userCaptchaInput);
  
   if ( !captchaResult ) { 
     return {
         success: false,
         fieldsState:{
         userName_isCorrect :  true ,
         passWord_isCorrect :  true ,
         mobile_number_isCorrect:true ,
         userCaptcha_isCorrect  : false , // کپچا - کد امنیتی اشتباه است
         userName_alreadyExist:false,
         connection_isCorrect:true
         },
         values:{ 
         userName:userName,
         mobile_number:mobile_number
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
         fieldsState: { 
          userName_isCorrect :  true ,
          passWord_isCorrect :  true ,
          mobile_number_isCorrect:true ,
          userCaptcha_isCorrect  : true ,
          userName_alreadyExist:true, // نام کاربری تکراری است
          connection_isCorrect:true
         },
         values:{ 
         userName:userName,
         mobile_number:mobile_number
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
         fieldsState:{
         userName_isCorrect :  true ,
         passWord_isCorrect :  true ,
         mobile_number_isCorrect:true ,
         userCaptcha_isCorrect  : true ,
         userName_alreadyExist:false,
         connection_isCorrect:false // ارتباط با سرور مشکل دارد
         },
         values:{ 
         userName:userName,
          mobile_number:mobile_number
        }
       }
   }
 
 
 }
