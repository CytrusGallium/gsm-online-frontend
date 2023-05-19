import React, { useState, useEffect } from 'react';
import DeviceStateSelector from './DeviceStateSelector';

const ProblemListValidator = (props) => {

    useEffect(() => {

        if (props.value) {
            let newArray = [];

            try {
                props.value.forEach(p => {
                    newArray.push({ key: p.key, name: p.name, price: p.price, state: "DONE" });
                });
            } catch (error) {
                console.log("FOR-EACH-ERROR");
            }

            setValue(newArray);

            // console.log("NEW ARRAY = " + JSON.stringify(newArray));
            if (props.onChange)
                props.onChange(newArray);
        }

    }, []);

    const [value, setValue] = useState();

    const handleProblemStateChange = (ParamValue, ParamKey) => {
        let tmpProblem = GetProblemByKey(ParamKey);
        tmpProblem.state = ParamValue;
        let tmpArray = value.filter((p) => {
            return p.key !== ParamKey;
        });
        tmpArray.push(tmpProblem);
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
            {props.value ? props.value.map(p => {
                return <div key={p.key} className='grid grid-cols-2 gap-1'>
                    <div className='bg-gray-700 p-1 mb-1 rounded-lg border border-gray-600 text-sm'>{p.name}</div><DeviceStateSelector onChange={(e) => handleProblemStateChange(e, p.key)} />
                </div>
            }) : <p>Cette appareil n'a aucun problem...</p>}
        </div>
    )
}

export default ProblemListValidator