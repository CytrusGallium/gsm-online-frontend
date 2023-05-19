import { React, useState } from 'react';
import { AwesomeButton } from 'react-awesome-button';
import Popup from 'reactjs-popup';
import { FaTimesCircle, FaRegFrown } from 'react-icons/fa';

const GenericMessagePopup = (props) => {

    const [message, setMessage] = useState("");

    const CloseModal = () => {
        props.onClose();
    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick={false}
                onClose={() => { CloseModal(); }}
                onOpen={() => { props.message && setMessage(props.message) && console.log("MESSAGE = " + props.message) }}
            >
                <div className={props.sad ? "modal bg-red-900 text-gray-100 p-2" : "modal bg-gray-900 text-gray-100 p-2"}>
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="flex flex-col items-center ">
                        {props.sad && <FaRegFrown size={48} className='my-2' />}
                    </div>
                    <div className="content flex flex-col items-center">
                        <span className='text-gray-100 text-lg font-bold mt-1' >{message}</span>
                        <br/>
                        {props.closeButton && <AwesomeButton type="primary" onPress={CloseModal}><div className='text-xl'>OK</div></AwesomeButton>}
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default GenericMessagePopup