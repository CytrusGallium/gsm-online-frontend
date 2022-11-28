import React from 'react';
import { useState } from 'react';
import RepairOrderItem from './RepairOrderItem';

const NewRepairOrderForm = () => {
  
    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

    const itemOnChange = (itemState, id) => {
        // console.log("ITEM ON CHANGE = " + id);
        // console.log("ITEM = " + GetItemByKey(id).type);
        itemStates[id] = itemState;
        console.log(itemStates[id].imei);
    }

    const [repairOrder, setRepairOrder] = useState({ location:"Tlemcen", customer:"", phone:"" });
    const [items, setItems] = useState([<RepairOrderItem key={1} id={1} onChange={itemOnChange} />]);
    var [itemStates, setItemStates] = useState([]);
    const [counter, setCounter] = useState(2);

    // var itemStates = [];

    // const GetItemByKey = (ParamKey) => {
        
    //     let result = null;
        
    //     items.forEach(item => {
    //         if (item.key == ParamKey)
    //         {
    //             // console.log("HIT : " + ParamKey);
    //             result = item;
    //         }
    //     });

    //     return result;
    // }

    const handleChange = ({ currentTarget: input }) => {
        setRepairOrder({...repairOrder, [input.name]: input.value });
    }

    const ConfirmOnClick = (event) => {
        event.preventDefault();
        
        console.log("OK");

        itemStates.forEach(item => {
            console.log("ITEM = " + item.imei);
        });
    }

    const AddItemOnClick = (event) => {
        event.preventDefault();

        setCounter(counter => counter + 1);
        items.push(<RepairOrderItem key={counter} id={counter} onChange={itemOnChange}/>);
    }

    return (
        <div className='grid h-screen place-items-center'>
            <p className='text-gray-100 font-bold mb-4'>Ajouter Un Ordre de Réparation</p>
            <form onSubmit={ConfirmOnClick}>
                <input type="text" name="location" placeholder="Emplacement..." value={repairOrder.location} onChange={handleChange} required className={inputFieldStyle} />
            <br/>
                <input type="text" name="customer" placeholder="Nom du Client..." value={repairOrder.customer} onChange={handleChange} required className={inputFieldStyle} />
            <br/>
                <input type="text" name="phone" placeholder="Téléphone du Client..." value={repairOrder.phone} onChange={handleChange} required className={inputFieldStyle} />
            <br/>
                <p className='text-gray-100 mt-4'>List des réparations :</p>
            <br/>
                {items.map(item => item )}
            <br/>
                <button type="button" name='add-item' className={buttonStyle} onClick={AddItemOnClick}>+</button>
            <br/>
                <button type="submit" name='submit' className={buttonStyle}>Confirmer</button>
            </form>
            <br/>
            {/* <p className='text-gray-100'>{errorMessage}</p> */}
        </div>
    )
}

export default NewRepairOrderForm