'use client'
import React from 'react'
import type { Player } from '../lib/types'

function Team({label,a,b}:{label:string,a?:string,b?:string}){
  return (
    <div className='px-2 py-1 rounded-lg bg-gray-50 border'>
      <div className='text-[10px] uppercase tracking-wide text-gray-500'>{label}</div>
      <div className='font-medium break-words'>{a} &amp; {b}</div>
    </div>
  )
}

export default function SwissSuggestion({pairs, id2player}:{
  pairs: {A:[string,string],B:[string,string]}[]
  id2player: Record<string, Player>
}){
  if(!pairs.length) return <p className='text-sm text-gray-500'>Isi skor dulu biar SwissScore kebentuk, nanti pasangan Swiss muncul di sini</p>
  return (
    <div className='grid gap-2'>
      {pairs.map((p, idx)=> (
        <div key={idx} className='p-3 rounded-xl border'>
          <div className='text-xs text-gray-500'>Match {idx+1}</div>
          <div className='flex flex-wrap items-center gap-2 mt-1'>
            <Team label='Team A' a={id2player[p.A[0]]?.name} b={id2player[p.A[1]]?.name} />
            <span className='opacity-60'>vs</span>
            <Team label='Team B' a={id2player[p.B[0]]?.name} b={id2player[p.B[1]]?.name} />
          </div>
        </div>
      ))}
    </div>
  )
}
