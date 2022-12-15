import React from 'react';
import { useState, useEffect } from 'react';
import DeviceProblemList from './DeviceProblemList';
import { FaLock } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const RepairOrderItem = (props) => {

  // useEffect(() => {
  //   console.log("!!!");
  //   setDummy(dummy + 1);
  // }, []);

  const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const buttonStyle = "mx-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded";

  const [itemState, setItemState] = useState({ key: props.id, deviceType: "SMART_PHONE", ref: "", imei: "", problems: "", estPrice: "0", price: "0", state: "PENDING" });
  const [dummy, setDummy] = useState(0);

  const handleChange = ({ currentTarget: input }) => {
    setItemState({ ...itemState, [input.name]: input.value }, handleChangeCallBack(input.name, input.value));
  }

  const handleChangeCallBack = (n, v) => {
    itemState[n] = v;
    props.onChange(itemState, props.id);
  }

  const handleRemove = () => {
    props.onRemove(props.id);
  }

  const updateProblemList = (ParamProblems) => {

    let tmpItemState = itemState;
    tmpItemState.problems = ParamProblems.problems;

    let total = 0;
    ParamProblems.problems.forEach(element => {
      total += Number(element.price);
    });

    tmpItemState.estPrice = total;

    setItemState(tmpItemState);
    props.onChange(itemState, props.id);
  }

  return (
    <div className='w-64 flex flex-col border-2 border-gray-300 mt-2 py-2 rounded-lg'>
      <label className='text-gray-100'>N° {props.id + 1}</label>
      <br />
      <select name="deviceType" className={inputStyle} value={itemState.deviceType} onChange={handleChange}>
        <option value="SMART_PHONE">Smart Phone</option>
        <option value="PHONE">Téléphone Portable</option>
        <option value="TABLET">Tablette</option>
        <option value="LAPTOP">Laptop</option>
        <option value="PC">PC de Bureau</option>
        <option value="AIO">All In One</option>
        <option value="OTHER">Autre</option>
      </select>
      <br />
      <input type="text" name="ref" placeholder="Référence..." value={itemState.ref} onChange={handleChange} className={inputStyle} />
      <br />
      <input type="text" name="imei" placeholder="IMEI..." value={itemState.imei} onChange={handleChange} className={inputStyle} />
      <br />
      <DeviceProblemList onChange={updateProblemList} />
      <br />
      <select name="state" className={inputStyle} defaultValue="PENDING" onChange={handleChange}>
        <option value="PENDING">En Cours de Réparation</option>
        <option value="DONE">Réparer</option>
        <option value="UNFIXABLE">Irréparable</option>
        <option value="CANCELED">Annulé</option>
      </select>
      <br />
      <div className='border border-gray-500 text-gray-100 m-2 p-2'>
        <label>Prix estimé</label>
        <br />
        <input type="number" name="estPrice" placeholder="Prix estimé..." value={itemState.estPrice} onChange={handleChange} className={inputStyle} readOnly={((itemState.problems.length > 1) ? true : false)} />
        {itemState.problems.length > 1 &&
          <div>
            <FaLock className='inline' size={16} data-tip="Le prix estimé est calculer automatiquement selon la liste des pannes." />
            <ReactTooltip />
          </div>
        }
        <br />
        <label>Prix final</label>
        <br />
        <input type="number" name="price" placeholder="Prix final..." value={itemState.price} onChange={handleChange} className={inputStyle} />
      </div>
      <br />
      {props.id > 0 && <button type="button" className={buttonStyle} onClick={handleRemove}>Enlever Cette Appareil</button>}
    </div>
  )
}

export default RepairOrderItem