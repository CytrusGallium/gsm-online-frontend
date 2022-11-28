import React from 'react';
import { useState } from 'react';

const RepairOrderItem = (props) => {
  
  const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const buttonStyle = "mx-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded";

  const [itemState, setItemState] = useState({ type:"", ref:"", imei:"", problem:"", estPrice:"0", price:"0", state:"Encours de réparation..." });

  const handleChange = ({ currentTarget: input }) => {
    setItemState({...itemState, [input.name]: input.value });
    props.onChange(itemState, props.id);
  }
  
  return (
    <div className='w-64 flex flex-col border border-gray-300 mt-2 py-2 rounded-lg'>
        <label className='text-gray-100'>N° {props.id}</label>
        <br/>
        <input type="text" name="type" placeholder="Type d'appareil..." value={itemState.type} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="text" name="ref" placeholder="Référence..." value={itemState.ref} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="text" name="imei" placeholder="IMEI..." value={itemState.imei} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="text" name="problem" placeholder="Panne/Motif..." value={itemState.problem} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="number" name="estPrice" placeholder="Prix estimé..." value={itemState.estPrice} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="number" name="price" placeholder="Prix final..." value={itemState.price} onChange={handleChange} className={inputStyle} />
        <br/>
        <input type="text" name="state" placeholder="Etat..." value={itemState.state} onChange={handleChange} className={inputStyle} />
        <br/>
        <button type="button" className={buttonStyle}>Enlever Cette Appareil</button>
    </div>
  )
}

export default RepairOrderItem