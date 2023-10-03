'use client'


type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  className?: string
  onClick: () => void
}

export default function Button({
  children,
  isLoading=false,
  disabled=false,
  className='w-full btn-sm  mt-4',
  onClick
}: ButtonProps) {

  

  return (
    <>
      <button disabled={disabled} className={`${disabled?'text-white bg-slate-600 hover:bg-slate-700':'text-white bg-blue-600 hover:bg-blue-700'} ${className}`} onClick={(e)=>{e.preventDefault();e.stopPropagation();onClick()}} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${isLoading?'flex':'hidden'} w-6 h-6 animate-spin`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        {children}
      </button>
    </>
  )
}
