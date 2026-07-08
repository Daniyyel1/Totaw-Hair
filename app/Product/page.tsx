import React from 'react'
import { doLogout } from '../lib/action'

const page = () => {
  return (
    <div>
        <form action={doLogout}>
             <button type='submit' >logout</button>
        </form>
        
    </div>
  )
}

export default page