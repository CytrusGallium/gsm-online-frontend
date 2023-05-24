import React from 'react';
import { useState, useEffect } from 'react';
import DeviceProblemList from './DeviceProblemList';
import { FaLock } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const RepairOrderItem = (props) => {

  useEffect(() => {

    if (props.value) {
      console.log("MARK 1 : " + JSON.stringify(props.value));
      setItemState(props.value);
      setProblems(props.value.problems);
      setEstPrice(UpdateAndGetTotalPrice(props.value.problems));
    }

    // props.onChange(itemState, props.id);
    // console.log("MARK 2 : " + JSON.stringify(itemState));
  }, []);

  const inputFieldStyle3rd = "inline w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const inputFieldStyleFull = "inline w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const buttonStyle = "mx-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded";

  const [itemState, setItemState] = useState({ key: props.id, deviceType: "SMART_PHONE", ref: "", imei: "", estPrice: "0", price: "0", state: "PENDING" });
  const [problems, setProblems] = useState([]);
  const [estPrice, setEstPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [dummy, setDummy] = useState(0);

  const handleEstPriceChange = (e) => {
    setEstPrice(e.target.value);
  }

  const handleChange = ({ currentTarget: input }) => {
    setItemState({ ...itemState, [input.name]: input.value }, handleChangeCallBack(input.name, input.value));
  }

  const handleChangeCallBack = (ParamName, ParamValue) => {
    console.log("MARK OLD : " + JSON.stringify(itemState));
    itemState[ParamName] = ParamValue;
    console.log("MARK NEW : " + JSON.stringify(itemState));
    props.onChange(props.id, itemState, problems, price);
  }

  const handleRemove = () => {
    props.onRemove(props.id);
  }

  const updateProblemList = (ParamProblems) => {

    console.log("MARK U : " + JSON.stringify(ParamProblems));

    // let tmpItemState = itemState;
    // tmpItemState.problems = ParamProblems;

    // let total = 0;
    // ParamProblems.forEach(element => {
    //   total += Number(element.price);
    // });

    // tmpItemState.estPrice = total;

    // setItemState(tmpItemState);
    // props.onChange(itemState, props.id);

    setProblems(ParamProblems);

    let total = UpdateAndGetTotalPrice(ParamProblems);

    if (props.onChange)
      props.onChange(props.id, itemState, ParamProblems, total);
  }

  const UpdateAndGetTotalPrice = (ParamProblems) => {
    let total = 0;
    if (ParamProblems && ParamProblems.length > 1) {
      ParamProblems.forEach(element => {
        total += Number(element.price);
      });

      setEstPrice(total);
    } else {
      total = estPrice;
    }
    return total;
  }

  return (
    <div className='w-full sm:w-4/5 flex flex-row flex-wrap items-center justify-center border-2 border-gray-300 mt-4 mb-4 py-2 rounded-lg bg-gray-900'>
      <label className='text-gray-100 w-full'>N° {props.id + 1}</label>
      <br />
      <select name="deviceType" className={inputFieldStyle3rd} value={itemState.deviceType} onChange={handleChange}>
        <option value="SMART_PHONE">Smart Phone</option>
        <option value="PHONE">Téléphone Portable</option>
        <option value="TABLET">Tablette</option>
        <option value="LAPTOP">Laptop</option>
        <option value="PC">PC de Bureau</option>
        <option value="AIO">All In One</option>
        <option value="OTHER">Autre</option>
      </select>
      <input type="text" name="ref" placeholder="Référence..." value={itemState.ref} onChange={handleChange} className={inputFieldStyle3rd} />
      <input type="text" name="imei" placeholder="IMEI..." value={itemState.imei} onChange={handleChange} className={inputFieldStyle3rd} />

      {/* {itemState.problems && itemState.problems.length > 0 && <div className='w-full bg-red-500'><DeviceProblemList onChange={updateProblemList} value={itemState.problems}/></div>} */}
      <div className='w-full'><DeviceProblemList onChange={updateProblemList} value={itemState.problems} /></div>

      <select name="state" className={inputFieldStyleFull} defaultValue="PENDING" onChange={handleChange}>
        <option value="PENDING">En Cours de Réparation</option>
        <option value="DONE">Réparer</option>
        <option value="UNFIXABLE">Irréparable</option>
        <option value="CANCELED">Annulé</option>
      </select>
      <div className='border border-gray-500 text-gray-100 m-2 p-2 w-full rounded-lg'>
        <label>Prix estimé</label>
        <br />
        <input type="number" name="estPrice" placeholder="Prix estimé..." value={estPrice} onChange={handleEstPriceChange} className={inputFieldStyle3rd} readOnly={((itemState.problems && itemState.problems.length > 1) ? true : false)} />
        {itemState.problems && itemState.problems.length > 1 &&
          <div>
            <FaLock className='inline' size={16} data-tip="Le prix estimé est calculer automatiquement selon la liste des pannes." />
            <ReactTooltip />
          </div>
        }
        <br />
        <label>Prix final</label>
        <br />
        <input type="number" name="price" placeholder="Prix final..." value={itemState.price} className={inputFieldStyle3rd} />
      </div>
      <br />
      {props.id > 0 && <button type="button" className={buttonStyle} onClick={handleRemove}>Enlever Cette Appareil</button>}
    </div>
  )
}

export default RepairOrderItem