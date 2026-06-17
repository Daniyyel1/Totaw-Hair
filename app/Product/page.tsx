import React from 'react'
import { doLogout } from '../actions/page'

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