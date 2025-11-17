'use client'
import React from 'react'
import type { ConfigWeights } from '../lib/types'

export default function ConfigPanel({config, setConfig}:{config: ConfigWeights, setConfig: (c: ConfigWeights)=>void}){
  function set(key: keyof ConfigWeights, val: string){
    setConfig({...config, [key]: Number(val)})
  }
  const fields: [keyof ConfigWeights,string][] = [
    ['WIN_BONUS','Win Bonus'],
    ['SET_WON_WEIGHT','Per Set Won'],
    ['POINT_DIFF_WEIGHT','Point Diff Weight'],
    ['LOSS_PARTICIPATION','Loss Participation'],
  ]
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {fields.map(([k,label])=> (
        <div key={k} className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700'>{label}</label>
          <input
            type='number'
            step='0.05'
            value={config[k]}
            onChange={e=>set(k, e.target.value)}
            className='w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/10'
          />
        </div>
      ))}
    </div>
  )
}
