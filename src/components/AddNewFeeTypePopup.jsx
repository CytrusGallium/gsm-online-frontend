import { React, useState, useRef } from 'react';
import { AwesomeButton } from 'react-awesome-button';
import Popup from 'reactjs-popup';
import { FaTimesCircle } from 'react-icons/fa';
import { InputFieldStyle } from '../Styles';
import axios from 'axios';
import { GetBackEndUrl } from '../const';

const AddNewFeeTypePopup = (props) => {

    const ref = useRef(null);

    const [designation, setDesignation] = useState("");

    const CloseModal = () => {
        props.onClose();
    }

    const handleDesignationChange = (event) => {
        setDesignation(event.target.value);
    }

    const AddOnClick = async () => {
        try {
            let feeTypeToPost = { name: designation };
            let url = GetBackEndUrl() + "/api/add-fee-type";
            console.log("POST : " + url);
            let res = await axios.post(url, feeTypeToPost);
            if (res) CloseModal();
        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick
                onClose={() => { CloseModal(); }}
                onOpen={() => { ref.current.focus(); }}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header">Ajouter un type de frai</div>
                    <br />
                    <div className="content flex flex-col items-center">
                        <label className='text-sm'>Designation :</label>
                        <input ref={ref} type="text" name='designation' placeholder='Designation...' value={designation} className={InputFieldStyle} onChange={handleDesignationChange} />
                        <br />
                        <AwesomeButton type="primary" onPress={AddOnClick}><div className='text-xl'>Ajouter</div></AwesomeButton>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default AddNewFeeTypePopup