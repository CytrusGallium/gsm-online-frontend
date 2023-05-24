import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import NetImage from './NetImage';

const MizzappChoicePanel = (props) => {

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        PrepareChoicesFromValue();

        return () => { };
    }, []);

    const PrepareChoicesFromValue = async () => {
        console.log("VALUE = " + JSON.stringify(props.value));

        let tmpArray = [];

        for (let i = 1; i <= 3; i++) {
            const result = await axios.get(GetBackEndUrl() + "/api/get-product?mizzappID=" + props.value[i]);
            if (result) {
                // console.log("RESULT = " + JSON.stringify(result));
                tmpArray[i] = { id: result.data._id, name: result.data.name };
            }
        }

        setSubjects(tmpArray);
    }

    return (
        <div className='px-2 sm:px-4 py-2.5 bg-gray-900 fixed h-full z-30 top-16 left-0 border-r-4 border-gray-600 w-1/3'>
            <div className='m-2 bg-gray-800 border border-gray-700 rounded-xl h-24 text-3xl text-gray-200 font-bold flex flex-row items-center justify-center'>
                <CountUp end={props.weight ? props.weight : 0} useEasing={false} preserveValue={true} duration='0.4' className='mr-2' /> Grams
            </div>
            <div className='flex flex-col items-center justify-center'>
                {subjects.map((s, i) => {
                    return <div key={i}>
                        {/* <div>{i + " /// " + s.name + " ///" + s.id}</div> */}
                        <div className='flex flex-row items-center justify-center'>
                            <div className='border-4 border-gray-500 rounded-xl text-3xl text-gray-500 font-bold w-32 h-32 pt-10 mt-4'>{i}</div>
                            <NetImage value={{ _id: s.id, name: s.name }} key={s.id} size={32} onClick={() => {props.onClick(i)}} />
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default MizzappChoicePanel