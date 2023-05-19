import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetBackEndUrl } from '../const';
import NetImage from './NetImage';

const MizzappChoicePanel = (props) => {

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        PrepareChoicesFromValue();

        return () => {};
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
        <div className='px-2 sm:px-4 py-2.5 bg-gray-900 fixed h-full z-30 top-16 left-0 border-4 border-gray-600 w-1/3'>
            <div className='flex flex-col items-center justify-center'>
                {subjects.map((s, i) => {
                    return <div key={i}>
                        {/* <div>{i + " /// " + s.name + " ///" + s.id}</div> */}
                        <div><NetImage value={{_id:s.id, name:s.name}} key={s.id} size={32}/></div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default MizzappChoicePanel