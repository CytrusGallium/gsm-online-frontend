import { React, useState } from 'react';
import axios from 'axios';
import DeviceIconList from './DeviceIconList';
import DeviceStateSelector from './DeviceStateSelector';
import { AwesomeButtonProgress } from 'react-awesome-button';
import { FaTimesCircle } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import { GetBackEndUrl } from '../const';
import ProblemListValidator from './ProblemListValidator';

const RepairOrderValidationPopup = (props) => {

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';

    const [checked, setChecked] = useState(true);
    const [roState, setRoState] = useState("DONE");
    const [note, setNote] = useState("");
    // const [totalEstPrice, setTotalEstPrice] = useState(0);
    const [paiement, setPaiement] = useState(0);
    const [items, setItems] = useState(null);

    const handleChange = () => {
        setChecked(!checked);
    };

    const CloseModal = () => {
        props.onClose();
    }

    const ValidateRepairOrderInDB = async (ParamROID, ParamState, ParamPaiement, ParamLock, ParamNote, ParamItems) => {

        console.log("ROID = " + ParamROID);

        try {

            let validationToPost = { roid: ParamROID, state: ParamState, fulfilledPaiement: ParamPaiement, locked: ParamLock, note: ParamNote, items:ParamItems };
            let url = GetBackEndUrl() + "/api/validate-repair-order";
            let res = await axios.post(url, validationToPost);

        } catch (error) {
            console.log("ERROR : " + error);
        }

    }

    const handleRoStateOnChange = (ParamValue) => {
        setRoState(ParamValue);
    }

    const handlePriceChange = (event) => {
        setPaiement(Number(event.target.value));
    }

    const GetTotalPrice = (ParamRepairOrder) => {

        if (!ParamRepairOrder || !ParamRepairOrder.items)
            return 0;

        let total = Number(0);
        ParamRepairOrder.items.forEach(i => {
            i.problems.forEach(p => {
                total += Number(p.price);
            });
        });

        return total;
    }

    const handleProblemListValidatorOnChange = (ParamItemKey, ParamValue) => {
        // console.log("K = " + JSON.stringify(ParamItemKey) + " ||| " + "V = " + JSON.stringify(ParamValue));

        // console.log("ITEMS = " + JSON.stringify(items));
        let target = props.value.items.filter(i => i.key == ParamItemKey);
        target[0].problems = ParamValue;
        // console.log("TARGET = " + JSON.stringify(target));
        
        let others = props.value.items.filter((i) => {
            return i.key !== ParamItemKey;
        });
        // console.log("OTHERS = " + JSON.stringify(others));
        others.push(target);
        console.log("RESULT AFTER CHANGE = " + JSON.stringify(others));
        setItems(others);
    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick
                onClose={() => { CloseModal(); }}
                // onOpen={() => setItems(props.value.items)}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header"> Validation de l'Ordre de Réparation </div>
                    <div className="content flex flex-col items-center">
                        Identifiant : {props.value.roid}
                        <br />
                        <br />
                        <DeviceIconList value={props.value.items} />
                        <br />
                        <p className='text-3xl font-bold'>Prix Total Estimé : {GetTotalPrice(props.value)} DA</p>
                        <br />
                        {/* {props.value.items && props.value.items.map((item,index) => <div key={index}><p>{JSON.stringify(item)} : </p><DeviceStateSelector onChange={handleRoStateOnChange} /></div>)} */}
                        {props.value.items && props.value.items.map((item) => <div key={item.key} className='m-2'><div className='mb-1 mr-1 p-2 bg-gray-800 rounded-xl font-bold text-lg'>{item.ref}</div><ProblemListValidator key={item.key} value={item.problems} onChange={(v) => {handleProblemListValidatorOnChange(item.key, v);} } /></div>)}
                        {/* <DeviceStateSelector onChange={handleRoStateOnChange} /> */}
                        <br />
                        <input type="text" name='price' placeholder='Montant payer...' className={inputFieldStyle} onChange={handlePriceChange} />
                        <br />
                        <textarea name="note" className={inputFieldStyle} value={note} rows="3" placeholder="Ajouter une Note/Observation..." onChange={(e) => { setNote(e.target.value) }} />
                        <br />
                        <label>
                            <input type="checkbox" checked={checked} onChange={handleChange} className='mx-1' />
                            Vérouiller
                        </label>
                        <br />
                        <AwesomeButtonProgress type="primary" onPress={async (element, next) => {
                            await ValidateRepairOrderInDB(props.value.roid, roState, paiement, checked, note, items);
                            next();
                        }}><div className='text-xl'>Valider</div></AwesomeButtonProgress>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default RepairOrderValidationPopup