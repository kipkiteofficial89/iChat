import React from 'react'

function InfoSingle({ title, data }) {
    return (
        <div className='px-3 mt-4'>
            <p className='text-sm text-zinc-500'>{title}</p>
            <p className='text-sm text-zinc-400 mt-1'>{data}</p>
        </div>
    )
}

export default InfoSingle
