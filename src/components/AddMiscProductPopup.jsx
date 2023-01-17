import { React, useState, useEffect, useRef } from 'react';
import { AwesomeButtonProgress } from 'react-awesome-button';
import Popup from 'reactjs-popup';
import { FaTimesCircle } from 'react-icons/fa';

const AddMiscProductPopup = (props) => {

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';

    // Effect
    // useEffect(() => {

    //     console.log("CSPPP Start-up");
    //     setPayment(props.value);

    // }, []);

    const ref = useRef(null);
    
    const [designation, setDesignation] = useState("");
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(0);

    const CloseModal = () => {
        props.onClose();
    }

    const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    }

    const handlePriceChange = (event) => {
        setPrice(Number(event.target.value));
    }

    const handleAmountChange = (event) => {
        setAmount(Number(event.target.value));
    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick
                onClose={() => { CloseModal(); }}
                onOpen={() => {ref.current.focus(); }}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header">Ajouter une consommation diverse</div>
                    <br />
                    <div className="content flex flex-col items-center">
                        <br />
                        <label className='text-sm'>Designation :</label>
                        <input ref={ref} type="text" name='designation' placeholder='Designation...' value={designation} className={inputFieldStyle} onChange={handleDesignationChange} />
                        <br/>
                        <label className='text-sm'>Prix Unitaire :</label>
                        <input type="number" name='price' placeholder='Prix unitaire...' value={price} className={inputFieldStyle} onChange={handlePriceChange} />
                        <br/>
                        <label className='text-sm'>Quantité :</label>
                        <input type="number" step={1} name='amount' placeholder='Quantité...' value={amount} className={inputFieldStyle} onChange={handleAmountChange} />
                        <br />
                        <AwesomeButtonProgress type="primary" onPress={async (element, next) => {
                            await props.onConfirm(designation, price, amount);
                            // next();
                            CloseModal();
                        }}><div className='text-xl'>Valider</div></AwesomeButtonProgress>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default AddMiscProductPopup