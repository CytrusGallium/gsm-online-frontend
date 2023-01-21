import { React, useState, useEffect, useRef } from 'react';
import { AwesomeButtonProgress } from 'react-awesome-button';
import Popup from 'reactjs-popup';
import { FaTimesCircle } from 'react-icons/fa';

const CateringSalesPointPaymentPopup = (props) => {

    const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';

    // Effect
    // useEffect(() => {

    //     console.log("CSPPP Start-up");
    //     setPayment(props.value);

    // }, []);

    const ref = useRef(null);

    const [payment, setPayment] = useState(0);
    const [showDiscountOrFee, setShowDiscountOrFee] = useState(true);

    const CloseModal = () => {
        props.onClose();
    }

    const handlePriceChange = (event) => {
        setPayment(Number(event.target.value));
    }

    const handleShowDiscountOrFeeChange = (event) => {
        setShowDiscountOrFee(!showDiscountOrFee);
    }

    const buildPriceDiffInfo = (ParamOriginalAmount, ParamPayedAmount) => {

        console.log("Building price diff info...");
        if (Number(ParamOriginalAmount) == Number(ParamPayedAmount))
            return { show: showDiscountOrFee, isDiff: false };
        else if (Number(ParamOriginalAmount) > Number(ParamPayedAmount))
            return { show: showDiscountOrFee, isDiff: true, diff: Number(ParamPayedAmount) - Number(ParamOriginalAmount), amountLabel: Number(ParamOriginalAmount) - Number(ParamPayedAmount), label: "Remise : " };
        else if (Number(ParamOriginalAmount) < Number(ParamPayedAmount))
            return { show: showDiscountOrFee, isDiff: true, diff: Number(ParamPayedAmount) - Number(ParamOriginalAmount), amountLabel: Number(ParamPayedAmount) - Number(ParamOriginalAmount), label: "Frais supplémentaire : " };
    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick
                onClose={() => { CloseModal(); }}
                onOpen={() => { setPayment(props.value); ref.current.select(); }}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header">Validation du Paiement</div>
                    <br />
                    <div className='text-center text-sm m-4 p-1' >Total à payer : <span className='bg-gray-700 font-bold rounded-xl p-1 m-1 px-2'>{props.value} DA</span></div>
                    <div className="content flex flex-col items-center">
                        <br />
                        <label className='text-sm'>Montant payer :</label>
                        <input ref={ref} type="number" name='price' placeholder='Montant payer...' value={payment} className={inputFieldStyle} onChange={handlePriceChange} />
                        <br />
                        {Number(payment) > Number(props.value) && <p className='mb-4'>Frais supplémentaire : {Number(payment) - Number(props.value)} DA</p>}
                        {Number(payment) < Number(props.value) && <p className='mb-4'>Remise : {Number(props.value) - Number(payment)} DA</p>}
                        {Number(payment) != Number(props.value) && <label className='mb-4'><input type="checkbox" checked={showDiscountOrFee} onChange={handleShowDiscountOrFeeChange} className='mx-1' />Afficher Remise/Frais sur le bon</label>}
                        <AwesomeButtonProgress type="primary" onPress={async (element, next) => {
                            await props.onConfirm(payment, buildPriceDiffInfo(props.value, payment));
                            CloseModal();
                        }}><div className='text-xl'>Valider</div></AwesomeButtonProgress>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default CateringSalesPointPaymentPopup