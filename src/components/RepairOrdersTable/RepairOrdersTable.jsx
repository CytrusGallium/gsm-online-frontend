import React, { useState, useEffect } from 'react';
import DeviceIconList from '../../components/DeviceIconList';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { ConvertMsToDHMS } from '../../Reaknotron/Libs/RknTimeTools';
import {
    FaWrench,
    FaLock,
    FaCheck,
    FaEdit,
    FaTrash,
    FaUnlock,
    FaKey,
    FaBarcode,
    FaUser,
    FaClock,
    FaDoorClosed,
    FaDollarSign,
    FaRegCalendarAlt,
    FaPhone,
    FaDoorOpen,
    FaPhoneSquare,
    FaHandshake,
    FaHistory
} from 'react-icons/fa';

const RepairOrdersTable = (props) => {

    useEffect(() => {
        // console.log("ITEMS = " + JSON.stringify(props.items));
        setItems(props.items);
    }, [props.items]);

    const [items, setItems] = useState([]);

    const GenerateOperationButtons = (ParamRepairOrder) => {

        const buttonStyle = 'bg-gray-900 text-gray-100 h-10 w-14 rounded-lg px-4 my-0.5 mx-0.5 text-sm hover:bg-gray-700 inline border border-gray-700 shadow-[0_5px_6px_-5px_rgba(0,0,0,0.95)] hover:shadow-[0_8px_7px_-5px_rgba(0,0,0,0.95)] duration-300';
        const iconSize = 20;

        if (ParamRepairOrder) {

            if (ParamRepairOrder.deleted) {
                return (
                    <div className='grid grid-cols-2'>
                        <button className={buttonStyle}> <Link to={"/add-repair-order?id=" + ParamRepairOrder.roid + "&history=true"}> <FaHistory size={iconSize} className='ml-0.5' /></Link> </button>
                    </div>
                )
            }
            
            if (ParamRepairOrder.locked) {
                return (
                    <div className='grid grid-cols-2'>
                        <button className={buttonStyle} onClick={() => { console.log("Unlock"); }}><FaKey size={iconSize} /></button>
                        <button className={buttonStyle}> <Link to={"/add-repair-order?id=" + ParamRepairOrder.roid + "&history=true"}> <FaHistory size={iconSize} className='ml-0.5' /></Link> </button>
                    </div>
                )
            }
            else {
                return (
                    <div className='grid grid-cols-2'>

                        <button className={buttonStyle} onClick={() => { props.onValidationClick(ParamRepairOrder); }}> <FaCheck size={iconSize} className='ml-0.5' /> </button>

                        <button className={buttonStyle}> <Link to={"/add-repair-order?id=" + ParamRepairOrder.roid}> <FaEdit size={iconSize} className='ml-0.5' /></Link> </button>

                        <button className='bg-red-900 text-gray-100 h-10 w-14 rounded-lg px-4 my-0.5 mx-0.5 text-sm hover:bg-red-700 inline border border-gray-700 shadow-[0_5px_6px_-5px_rgba(0,0,0,0.95)] hover:shadow-[0_8px_7px_-5px_rgba(0,0,0,0.95)] duration-300' onClick={() => { props.onDeleteClick(ParamRepairOrder); }}>
                            <FaTrash size={iconSize} className='ml-0.5' />
                        </button>
                        
                        <button className={buttonStyle}> <Link to={"/add-repair-order?id=" + ParamRepairOrder.roid + "&history=true"}> <FaHistory size={iconSize} className='ml-0.5' /></Link> </button>

                    </div>
                )
            }
        }

        return "N/A";
    }

    const normalItemStyle = 'bg-gray-900 rounded-xl p-1 pt-0.5 pb-2 my-1 border-2 border-gray-500';
    const lockedItemStyle = 'bg-green-900 bg-opacity-40 rounded-xl p-1 pt-0.5 pb-2 my-1 border-2 border-gray-500';
    const deletedItemStyle = 'bg-red-700 bg-opacity-40 rounded-xl p-1 pt-0.5 pb-2 my-1 border-2 border-gray-500';

    return (
        <div className='text-gray-100 flex flex-col items-center justify-center mx-4 p-2 rounded-xl'>
            {items &&
                items.map((item, index) => {
                    return (
                        <motion.div
                            className={item.deleted ? deletedItemStyle : item.locked ? lockedItemStyle : normalItemStyle}
                            initial={{ opacity: 0, x: "-50%" }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            key={index}
                        >

                            {/* Main Info */}
                            <div className='p-1 flex flex-row text-xl font-bold'>
                                <div className='flex flex-col items-center w-32 h-10 rounded-lg pt-2 bg-gray-100 text-gray-800 mr-0.5'>{item.locked ? <FaLock /> : <FaWrench />}</div>
                                <div className='w-80 h-10 rounded-lg pt-1 bg-gray-100 text-gray-800 mr-0.5'><FaBarcode className='inline mr-2 mb-1' />{item.roid}</div>
                                <div className='w-80 h-10 rounded-lg pt-1 bg-gray-100 text-gray-800 mr-0.5'><FaUser className='inline mr-2 mb-1' />{item.customer}</div>
                                <div className='w-80 h-10 rounded-lg pt-1 bg-gray-100 text-gray-800'>Liste des Appareils</div>
                            </div>

                            {/* Secondary Info */}
                            <div className='px-1 flex flex-row font-bold text-lg'>
                                <div className='flex flex-col items-center w-32 h-24 rounded-lg py-0.5 border border-gray-500 mr-0.5'>
                                    {/* <FaCheck /> <FaEdit /> <FaTrash /> */}
                                    {GenerateOperationButtons(item)}
                                </div>
                                <div className='w-80 h-24 rounded-lg pt-1 border border-gray-500 mr-0.5 flex flex-col items-start'>
                                    <div><FaRegCalendarAlt size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline text-sm'>{(new Date(item.time)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div></div>
                                    <div><FaDoorOpen size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline text-sm'>{item.exitDate ? (new Date(item.exitDate)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "..."}</div></div>
                                    <div><FaClock size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline text-sm'>{item.exitDate ? ConvertMsToDHMS(new Date(item.exitDate).getTime() - new Date(item.time).getTime()) : "..."}</div></div>
                                </div>
                                <div className='w-80 h-24 rounded-lg pt-1 border border-gray-500 mr-0.5 flex flex-col items-start'>
                                    <div><FaPhone size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline'>{item.phone}</div></div>
                                    <div><FaDollarSign size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline'>{item.totalPrice ? item.totalPrice : "0"} DA</div></div>
                                    <div><FaHandshake size={20} className='inline mb-0.5 mx-2 w-1/10' /> <div className='w-9/10 inline'>{item.fulfilledPaiement ? item.fulfilledPaiement : "0"} DA</div></div>
                                </div>
                                <div className='w-80 h-24 rounded-lg border border-gray-500 mr-0.5 py-2'>
                                    <DeviceIconList value={item.items} />
                                </div>
                            </div>
                        </motion.div>
                    )
                }
                )
            }
        </div>
    )
}

export default RepairOrdersTable