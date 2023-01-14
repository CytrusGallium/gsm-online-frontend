import React from 'react'

const ConsumedProductTag = (props) => {
    return (
        <div className='inline m-1 bg-gray-700 rounded-xl px-2 py-1 text-sm cursor-pointer select-none hover:bg-gray-500' onClick={props.onClick}>
            {props.value.amount > 1 &&
                <div className='inline mr-1 px-2 py-0.5 bg-gray-900 rounded-xl font-bold'>
                    {props.value.amount}
                </div>}
            {props.value.name}
        </div>
    )
}

export default ConsumedProductTag