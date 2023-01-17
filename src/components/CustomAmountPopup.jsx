import { React, useState, useRef } from 'react';
import { AwesomeButton } from 'react-awesome-button';
import Popup from 'reactjs-popup';
import { FaTimesCircle } from 'react-icons/fa';

const CustomAmountPopup = (props) => {

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';

    const ref = useRef(null);
    
    const [amount, setAmount] = useState("");

    const CloseModal = () => {
        props.onClose();
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
                onOpen={() => {ref.current.select(); }}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header">Designer la Quantité</div>
                    <br />
                    <div className="content flex flex-col items-center">
                        <input ref={ref} type="number" step={1} name='amount' placeholder='Quantité...' value={amount} className={inputFieldStyle} onChange={handleAmountChange} />
                        <br />
                        <AwesomeButton type="primary" onPress={() => {
                            props.onConfirm(amount);
                            CloseModal();
                        }}><div className='text-xl'>Valider</div></AwesomeButton>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default CustomAmountPopup