import React from 'react'
import { clsx } from 'clsx'

export function Button({children, className='', ...props}: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={clsx('px-3 py-2 rounded-2xl border bg-white shadow-sm hover:shadow transition whitespace-nowrap', className)}
    >
      {children}
    </button>
  )
}
