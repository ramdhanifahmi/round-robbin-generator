'use client'
import React from 'react'
import type { Match, Player } from '../lib/types'

function needThirdSet(m: Match){
  const s0a = typeof m.sets[0].a === 'number' ? m.sets[0].a : undefined;
  const s0b = typeof m.sets[0].b === 'number' ? m.sets[0].b : undefined;
  const s1a = typeof m.sets[1].a === 'number' ? m.sets[1].a : undefined;
  const s1b = typeof m.sets[1].b === 'number' ? m.sets[1].b : undefined;
  if(s0a===undefined || s0b===undefined || s1a===undefined || s1b===undefined) return false;
  const w0 = s0a === s0b ? '' : (s0a > s0b ? 'A' : 'B');
  const w1 = s1a === s1b ? '' : (s1a > s1b ? 'A' : 'B');
  return !!w0 && !!w1 && w0 !== w1;
}

export default function MatchesTable({matches, id2player, setSetScore, setCourt}:{
  matches: Match[]
  id2player: Record<string, Player>
  setSetScore: (matchId: string, setIdx: number, side: 'a'|'b', val: string)=>void
  setCourt: (matchId: string, val: string)=>void
}){
  if(!matches.length) return <p className='text-sm text-gray-500'>Belum ada jadwal — generate Round 1 dulu</p>
  if(!matches.length) return <p className='text-sm text-gray-500'>Belum ada jadwal — generate Round 1 dulu</p>
  return (
    <>
      {/* Mobile: rounds as swipeable panels */}
      <div className='lg:hidden overflow-x-auto snap-x snap-mandatory flex gap-3'>
        {[...new Set(matches.map(m=>m.round))].sort((a,b)=>a-b).map(rnd => (
          <div key={rnd} className='snap-start shrink-0 w-full'>
            <div className='text-sm font-semibold mb-2'>Round {rnd}</div>
            <div className='grid gap-3'>
              {matches.filter(m=>m.round===rnd).map(m => (
                <div key={m.id} className='p-3 rounded-xl border'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='text-sm font-medium'>Court</div>
                    <input type='number' value={m.court||''} onChange={e=>setCourt(m.id, e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                  </div>
                  <div className='mt-2 space-y-1'>
                    <div className='text-sm'><span className='text-gray-500'>Team A:</span> <span className='font-medium'>{id2player[m.teamA[0]]?.name}</span> &amp; <span className='font-medium'>{id2player[m.teamA[1]]?.name}</span></div>
                    <div className='text-sm'><span className='text-gray-500'>Team B:</span> <span className='font-medium'>{id2player[m.teamB[0]]?.name}</span> &amp; <span className='font-medium'>{id2player[m.teamB[1]]?.name}</span></div>
                  </div>
                  <div className='mt-3 grid grid-cols-1 gap-2'>
                    {[0,1].map(si => (
                      <div key={si} className='flex items-center justify-between gap-2'>
                        <div className='text-xs text-gray-600'>Set {si+1}</div>
                        <div className='flex items-center gap-1'>
                          <input type='number' inputMode='numeric' value={m.sets[si].a} onChange={e=>setSetScore(m.id, si, 'a', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                          <span>-</span>
                          <input type='number' inputMode='numeric' value={m.sets[si].b} onChange={e=>setSetScore(m.id, si, 'b', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                        </div>
                      </div>
                    ))}
                    {needThirdSet(m) && (
                      <div className='flex items-center justify-between gap-2'>
                        <div className='text-xs text-gray-600'>Set 3</div>
                        <div className='flex items-center gap-1'>
                          <input type='number' inputMode='numeric' value={m.sets[2].a} onChange={e=>setSetScore(m.id, 2, 'a', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                          <span>-</span>
                          <input type='number' inputMode='numeric' value={m.sets[2].b} onChange={e=>setSetScore(m.id, 2, 'b', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: wide table */}
      <div className='hidden lg:block w-full max-w-full overflow-x-auto'>
        <table className='min-w-max text-sm'>
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
                {[0,1].map(si=> (
                  <td key={si} className='p-2'>
                    <div className='flex items-center gap-1'>
                      <input type='number' min={0} value={m.sets[si].a} onChange={e=>setSetScore(m.id, si, 'a', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                      <span>-</span>
                      <input type='number' min={0} value={m.sets[si].b} onChange={e=>setSetScore(m.id, si, 'b', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                    </div>
                  </td>
                ))}
                <td className='p-2'>
                  {needThirdSet(m) ? (
                    <div className='flex items-center gap-1'>
                      <input type='number' min={0} value={m.sets[2].a} onChange={e=>setSetScore(m.id, 2, 'a', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                      <span>-</span>
                      <input type='number' min={0} value={m.sets[2].b} onChange={e=>setSetScore(m.id, 2, 'b', e.target.value)} className='w-16 px-2 py-1 rounded-lg border'/>
                    </div>
                  ) : (
                    <span className='text-gray-400'>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
