  "use client"

import { doSocialLogin } from '@/app/actions/page'
import React from 'react'

const page = () => {
  return (
     <div>
         <div>
             <form action={doSocialLogin}>
                <button type='submit' name='action' value='google'>Sign in with Google</button>
               
             </form>
         </div>
    </div>
  )
}

export default page