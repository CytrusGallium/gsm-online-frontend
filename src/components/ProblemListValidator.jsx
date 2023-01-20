import React, { useState, useEffect } from 'react';
import DeviceStateSelector from './DeviceStateSelector';

const ProblemListValidator = (props) => {

    useEffect(() => {

        let newArray = [];

        props.value.forEach(p => {
            newArray.push({key:p.key, name:p.name, price:p.price, state:"DONE"});
        });

        setValue(newArray);

        // console.log("NEW ARRAY = " + JSON.stringify(newArray));
        props.onChange(newArray);

    }, []);
    
    const [value, setValue] = useState();

    const handleProblemStateChange = (ParamValue, ParamKey) => {
        // console.log("V = " + JSON.stringify(value));
        // console.log("K = " + ParamKey);
        let tmpProblem = GetProblemByKey(ParamKey);
        // console.log("P = " + JSON.stringify(p));
        // console.log("V = " + ParamValue);
        tmpProblem.state = ParamValue;
        // console.log("P2 = " + JSON.stringify(p));
        // let tmpArray = value.filter(p => p.key != ParamKey);
        let tmpArray = value.filter((p) => {
            return p.key !== ParamKey;
        });
        // console.log("TMP ARRAY = " + JSON.stringify(tmpArray));
        tmpArray.push(tmpProblem);
        // console.log("TMP ARRAY = " + JSON.stringify(tmpArray));
        props.onChange(tmpArray);
    }

    const GetProblemByKey = (ParamKey) => {

        let result = value.filter(p => p.key == ParamKey);

        if (result[0])
            return result[0];
        else
            return null;
    }

    return (
        <div className='grid grid-cols-1 gap-0'>
            {/* <p>{props.value.length}</p>
            <p>{JSON.stringify(props.value)}</p> */}
            {props.value.map(p => {
                return <div key={p.key} className='grid grid-cols-2 gap-1'>
                    <div className='bg-gray-700 p-1 mb-1 rounded-lg border border-gray-600 text-sm'>{p.name}</div><DeviceStateSelector onChange={(e) => handleProblemStateChange(e, p.key)} />
                </div>
                // return <div key={p.key}>HELLO</div>
            })}
        </div>
    )
}

export default ProblemListValidator