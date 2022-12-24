import React from 'react';
import { useState } from 'react';

const DeviceStateSelector = (props) => {
    
    const [value, setValue] = useState("DONE");

    const handleChange = (event) => {
        setValue(event.target.value);

        if (props.onChange)
            props.onChange(event.target.value);
    }
    
    return (
        <div>
            <select name="state" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={value} onChange={handleChange}>
                <option value="PENDING">En Cours de Réparation</option>
                <option value="DONE">Réparer</option>
                <option value="UNFIXABLE">Irréparable</option>
                <option value="CANCELED">Annulé</option>
            </select>
        </div>
    )
}

export default DeviceStateSelector