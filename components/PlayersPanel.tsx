'use client'
import React, { useState } from 'react'
import type { Player } from '../lib/types'
import { Button } from './Button'

export default function PlayersPanel({players, addPlayer, removePlayer}:{
  players: Player[]
  addPlayer: (name: string)=>void
  removePlayer: (id: string)=>void
}){
  const [name, setName] = useState('')
  return (
    <div>
      <div className='flex flex-col sm:flex-row gap-2 mb-3'>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Add player name' className='flex-1 min-w-0 px-3 py-2 rounded-xl border'/>
        <Button className='w-full sm:w-auto' onClick={()=>{addPlayer(name); setName('')}}>Add</Button>
      </div>
      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1'>
        {players.map(p=> (
          <li key={p.id} className='flex items-center justify-between px-3 py-2 rounded-xl border'>
            <span className='truncate'>{p.name}</span>
            <button onClick={()=>removePlayer(p.id)} className='text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600'>remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
