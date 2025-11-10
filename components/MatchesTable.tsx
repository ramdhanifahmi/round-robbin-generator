'use client'
import React from 'react'
import type { Match, Player } from '../lib/types'

export default function MatchesTable({matches, id2player, setSetScore, setCourt}:{
  matches: Match[]
  id2player: Record<string, Player>
  setSetScore: (matchId: string, setIdx: number, side: 'a'|'b', val: string)=>void
  setCourt: (matchId: string, val: string)=>void
}){
  if(!matches.length) return <p className='text-sm text-gray-500'>Belum ada jadwal — generate Round 1 dulu</p>
  if(!matches.length) return <p className='text-sm text-gray-500'>Belum ada jadwal — generate Round 1 dulu</p>
  return (
    <div className='overflow-auto'>
      <table className='min-w-full text-sm'>
        <thead>
          <tr className='bg-gray-100 text-left'>
            <th className='p-2'>Round</th>
            <th className='p-2'>Court</th>
            <th className='p-2'>Team A</th>
            <th className='p-2'>Team B</th>
            <th className='p-2'>Set 1 (A-B)</th>
            <th className='p-2'>Set 2 (A-B)</th>
            <th className='p-2'>Set 3 (A-B)</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(m=> (
            <tr key={m.id} className='border-b'>
              <td className='p-2'>{m.round}</td>
              <td className='p-2'>
                <input type='number' value={m.court||''} onChange={e=>setCourt(m.id, e.target.value)} className='w-20 px-2 py-1 rounded-lg border'/>
              </td>
              <td className='p-2'>
                <div className='font-medium'>{id2player[m.teamA[0]]?.name} &amp; {id2player[m.teamA[1]]?.name}</div>
              </td>
              <td className='p-2'>
                <div className='font-medium'>{id2player[m.teamB[0]]?.name} &amp; {id2player[m.teamB[1]]?.name}</div>
              </td>
              {[0,1,2].map(si=> (
                <td key={si} className='p-2'>
                  <div className='flex items-center gap-1'>
                    <input type='number' min={0} value={m.sets[si].a} onChange={e=>setSetScore(m.id, si, 'a', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                    <span>-</span>
                    <input type='number' min={0} value={m.sets[si].b} onChange={e=>setSetScore(m.id, si, 'b', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
