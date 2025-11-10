'use client'
import React from 'react'
import type { StatRow } from '../lib/types'

export default function StatsTable({stats}:{stats: StatRow[]}){
  return (
    <div className='overflow-auto'>
      <table className='min-w-full text-sm'>
        <thead>
          <tr className='bg-gray-100 text-left'>
            <th className='p-2'>#</th>
            <th className='p-2'>Player</th>
            <th className='p-2'>MP</th>
            <th className='p-2'>W</th>
            <th className='p-2'>L</th>
            <th className='p-2'>Sets</th>
            <th className='p-2'>Pts</th>
            <th className='p-2'>PD</th>
            <th className='p-2'>Rub</th>
            <th className='p-2'>StW</th>
            <th className='p-2'>SwissScore</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, idx)=> (
            <tr key={s.playerId} className='border-b'>
              <td className='p-2'>{idx+1}</td>
              <td className='p-2 font-medium'>{s.name}</td>
              <td className='p-2'>{s.MP}</td>
              <td className='p-2'>{s.W}</td>
              <td className='p-2'>{s.L}</td>
              <td className='p-2'>{s.SW}-{s.SL}</td>
              <td className='p-2'>{s.PW}-{s.PL}</td>
              <td className='p-2'>{s.PD}</td>
              <td className='p-2'>{s.RW}</td>
              <td className='p-2'>{s.STW}</td>
              <td className='p-2 font-semibold'>{s.score.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
