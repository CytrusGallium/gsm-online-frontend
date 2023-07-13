import React from 'react';
import { AwesomeButton } from 'react-awesome-button';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactHotkeys from 'react-hot-keys';

const RknConfirmationPopup = (props) => {

    const onConfirm = () => {
        if (props.onConfirm)
            props.onConfirm();
    }

    const onCancel = () => {
        if (props.onCancel)
            props.onCancel();
    }

    return (
        <div className='bg-black bg-opacity-60 backdrop-blur fixed top-0 w-screen h-screen z-40 flex items-center justify-center'>
            <motion.div className='bg-gray-900 border-4 border-gray-700 rounded-xl w-1/3 h-1/3 flex flex-col items-center justify-center'
                initial={{ opacity: 0, y: "-50%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >

                <ReactHotkeys
                    keyName="Escape"
                    onKeyDown={onCancel}
                    filter={(event) => {
                        return true;
                    }}>
                </ReactHotkeys>

                {/* Message */}
                <div className='m-1 p-2 rounded-lg bg-gray-800'>
                    {props.message ? props.message : "Êtes-vous sure de vouloir effectuer cette opération ?"}
                </div>

                <br />

                {/* Buttons */}
                <div className='flex flex-row items-center justify-center'>
                    <AwesomeButton type={props.danger ? 'danger' : 'primary'} before={<FaCheck />} onPress={onConfirm} >Confirmer</AwesomeButton>
                    <span className='w-4'></span>
                    <AwesomeButton type='primary' before={<FaTimes />} onPress={onCancel} >Annuler</AwesomeButton>
                </div>

            </motion.div>
        </div>
    )
}

export default RknConfirmationPopup