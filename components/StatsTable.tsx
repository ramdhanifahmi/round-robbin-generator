'use client'
import React from 'react'
import type { StatRow } from '../lib/types'

export default function StatsTable({stats}:{stats: StatRow[]}){
  return (
    <>
      {/* Mobile: stacked list per player, no horizontal scroll */}
      <div className='grid gap-3 lg:hidden'>
        {stats.map((s, idx)=> (
          <div key={s.playerId} className='p-3 rounded-xl border'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>#{idx+1}</div>
              <div className='text-sm font-semibold'>{s.score.toFixed(2)}</div>
            </div>
            <div className='mt-1 font-medium'>{s.name}</div>
            <div className='mt-2 space-y-1 text-xs'>
              <div className='flex justify-between'><span className='text-gray-500'>MP</span><span>{s.MP}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>W / L</span><span>{s.W} / {s.L}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>Sets</span><span>{s.SW}-{s.SL}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>Pts</span><span>{s.PW}-{s.PL}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>PD</span><span>{s.PD}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>Rub</span><span>{s.RW}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>StW</span><span>{s.STW}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table view */}
      <div className='hidden lg:block w-full max-w-full overflow-x-auto'>
        <table className='min-w-max text-sm'>
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
    </>
  )
}
