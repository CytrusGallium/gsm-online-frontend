import React from 'react';
import { useState, useEffect } from 'react';
// import DeviceProblemList from './DeviceProblemList';
import ReactHotkeys from 'react-hot-keys';
import { motion } from "framer-motion";

const RepairOrderItem = (props) => {

  useEffect(() => {

    if (props.value) {
      setItemState(props.value);
      setProblems(props.value.problems);
      setEstPrice(UpdateAndGetTotalPrice(props.value.problems));
    }

    // props.onChange(itemState, props.id);
    // console.log("MARK 2 : " + JSON.stringify(itemState));
  }, []);

  const inputFieldStyle3rd = "inline w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const inputFieldStyleFull = "inline w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const buttonStyle = "mx-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded";

  const [itemState, setItemState] = useState({ key: props.id, deviceType: "SMART_PHONE", ref: "", imei: "", state: "PENDING" });
  const [problems, setProblems] = useState([]);
  const [estPrice, setEstPrice] = useState(0);
  const [price, setPrice] = useState(0);
  // const [dummy, setDummy] = useState(0);

  const handleItemInfoInputFieldChange = ({ currentTarget: input }) => {
    setItemState({ ...itemState, [input.name]: input.value }, handleItemInfoInputFieldChangeCallBack(input.name, input.value));
  }

  const handleItemInfoInputFieldChangeCallBack = (ParamName, ParamValue) => {
    // console.log("MARK OLD : " + JSON.stringify(itemState));
    // itemState[ParamName] = ParamValue;
    // console.log("MARK NEW : " + JSON.stringify(itemState));
    props.onChange(props.id, itemState, problems, estPrice);
  }

  const HandleNameOrPriceChange = ({ currentTarget: input }) => {
    let tmpProblems = problems;

    let result = null;

    tmpProblems.forEach(element => {
      if (element.key == input.id)
        result = element;
    });

    if (result == null)
      return;

    if (input.name == "problem")
      result.name = input.value;
    else if (input.name == "price")
      result.price = input.value;

    tmpProblems = [...problems];
    setProblems(tmpProblems);

    const estPrice = UpdateAndGetTotalPrice(tmpProblems);

    if (props.onChange)
      props.onChange(props.id, itemState, tmpProblems, estPrice);
  }

  const handleRemove = () => {
    props.onRemove(props.id);
  }

  const OnAddProblem = () => {
    let tmpProblems = problems;
    tmpProblems = [...problems, { key: problems.length + 1, name: "", price: 0 }];
    setProblems(tmpProblems);

    if (props.onChange)
      props.onChange(props.id, itemState, tmpProblems, estPrice);
  }

  const UpdateAndGetTotalPrice = (ParamProblems) => {
    let total = 0;

    ParamProblems.forEach(element => {
      total += Number(element.price);
    });

    setEstPrice(total);

    return total;
  }

  return (
    <div className='w-full flex flex-col border-2 border-gray-300 mt-4 mb-4 py-2 rounded-lg bg-gray-900'>
      <label className='text-gray-100 w-full mb-2 font-bold pb-1'>N° {props.id + 1}</label>

      {/* Device Info */}
      <div className='flex flex-row flex-wrap items-center justify-center'>
        <select name="deviceType" className={inputFieldStyle3rd} value={itemState.deviceType} onChange={handleItemInfoInputFieldChange}>
          <option value="SMART_PHONE">Smart Phone</option>
          <option value="PHONE">Téléphone Portable</option>
          <option value="TABLET">Tablette</option>
          <option value="LAPTOP">Laptop</option>
          <option value="PC">PC de Bureau</option>
          <option value="AIO">All In One</option>
          <option value="OTHER">Autre</option>
        </select>
        <input type="text" name="ref" placeholder="Référence..." value={itemState.ref} onChange={handleItemInfoInputFieldChange} className={inputFieldStyle3rd} />
        <input type="text" name="imei" placeholder="IMEI..." value={itemState.imei} onChange={handleItemInfoInputFieldChange} className={inputFieldStyle3rd} />
      </div>

      {/* {itemState.problems && itemState.problems.length > 0 && <div className='w-full bg-red-500'><DeviceProblemList onChange={updateProblemList} value={itemState.problems}/></div>} */}
      {/* <div className='w-full'><DeviceProblemList onChange={updateProblemList} value={itemState.problems} /></div> */}

      {/* Problem List Management */}
      <div className='border border-gray-700 p-2 mx-2 mt-2 rounded-xl'>
        <ReactHotkeys
          keyName="F2"
          onKeyDown={OnAddProblem}
          filter={(event) => {
            return true;
          }}
        ></ReactHotkeys>

        <h4 className='text-gray-100 mb-1'>Liste Des Pannes</h4>
        {
          problems.map(problem =>
            <motion.div
              initial={{ opacity: 0, x: "-33%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className='flex-1 flex-nowrap flex-row' key={problem.key} >
              <span className='text-gray-400 mr-1 bg-gray-800 rounded-lg p-1 px-2 text-lg font-bold'>Panne N° {problem.key}</span>
              <input type="text" name="problem" id={problem.key} placeholder="Panne.." onChange={HandleNameOrPriceChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0.5 mx-0.5 p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/3" autoComplete="off" value={problem.name} />
              <input type="number" name="price" id={problem.key} placeholder="Prix.." onChange={HandleNameOrPriceChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0.5 mx-0.5 p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/3" autoComplete="off" value={problem.price} />
            </motion.div>
          )
        }

        <br />
        {/* Button to add new problem */}
        <div className='cursor-pointer flex flex-col items-center'>
          <div onClick={OnAddProblem} className="mx-2 bg-blue-500 hover:bg-blue-400 text-white font-bold p-1 pt-0.5 border-b-4 border-blue-700 hover:border-blue-500 rounded w-8 h-8">+</div>
          <div className="text-gray-500 text-sm">F2</div>
        </div>
      </div>

      <br />

      {/* Overall items state */}
      <select name="state" className="mx-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0 mx-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue="PENDING" onChange={handleItemInfoInputFieldChange}>
        <option value="PENDING">En Cours de Réparation</option>
        <option value="DONE">Réparer</option>
        <option value="UNFIXABLE">Irréparable</option>
        <option value="CANCELED">Annulé</option>
      </select>

      {/* Stats */}
      <div className='border border-gray-500 text-gray-800 font-bold m-2 p-1 rounded-lg flex flex-row items-center justify-center'>
        <div className='w-1/2 bg-gray-300 rounded-l-lg mr-0.5 text-2xl font-bold p-1'>Prix Total Estimé : {estPrice} DA</div>
        <div className='w-1/2 bg-gray-300 rounded-r-lg ml-0.5 text-2xl font-bold p-1'>Paiement Effectué : {price} DA</div>
      </div>
      <br />

      {props.id > 0 && <button type="button" className={buttonStyle} onClick={handleRemove}>Enlever Cette Appareil</button>}
    </div>
  )
}

export default RepairOrderItem