import React from 'react';

const ComputerSpecsEditor = (props) => {
    return (
        <div className='border border-gray-100 text-gray-100 my-1 p-1 text-sm w-64'>
            ComputerSpecsEditor
            <br/>
            {JSON.stringify(props.value)}
        </div>
    )
}

export default ComputerSpecsEditor