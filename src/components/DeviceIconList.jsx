import React from 'react';
import { FaMobileAlt, FaPhone, FaTabletAlt, FaQuestionCircle, FaLaptop, FaDesktop, FaTv } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import ItemRepairState from '../Enums';

const DeviceIconList = (props) => {
    return (
        <div>
            {props.value && props.value.length > 1 && props.value.map((i, index) =>
                <div className='inline' key={index}>
                    {i[0] ? DeviceTypeToIcon(i[0].deviceType, i[0].imei, i[0].problems, i[0].ref, i[0].key, i[0].state, i[0].estPrice) : DeviceTypeToIcon(i.deviceType, i.imei, i.problems, i.ref, i.key, i.state, i.estPrice)}
                </div>
            )}

            {props.value &&
                <div className='flex flex-row items-center justify-center'>
                    <div className='w-60'>
                        {props.value[0] && props.value[0][0] && props.value[0][0].problems.map((i, index) => {
                            return (
                                <div className='text-xs p-0.5 m-0.5 ml-4 rounded-xl border border-gray-500' key={index}><span className='text-gray-500'>{"Panne N° " + (index + 1) + " : "}</span> {i.name + " ( " + i.price + " DA )"}</div>
                            )
                        })}
                        {props.value[0] && props.value[0][0] == null && props.value[0].problems.map((i, index) => {
                            return (
                                <div className='text-xs p-0.5 m-0.5 ml-4 rounded-xl border border-gray-500' key={index}><span className='text-gray-500'>{"Panne N° " + (index + 1) + " : "}</span> {i.name + " ( " + i.price + " DA )"}</div>
                            )
                        })}
                    </div>
                    <div className='w-20 flex flex-col items-center justify-center m-1'>
                        <div>{props.value[0] && props.value[0][0] && DeviceTypeToIconOnly(props.value[0][0].deviceType, 1, props.value[0][0].state)}</div>
                        <div>{props.value[0] && props.value[0][0] == null && DeviceTypeToIconOnly(props.value[0].deviceType, 1, props.value[0].state)}</div>
                        <div className='text-sm mr-1 mt-1'>{props.value[0] && props.value[0][0] && props.value[0][0].ref}</div>
                        <div className='text-sm mr-1 mt-1'>{props.value[0] && props.value[0][0] == null && props.value[0].ref}</div>
                    </div>
                </div>
            }

            {props.value && props.value.length > 1 && <ReactTooltip multiline={true} />}

        </div>
    )
}

const BuildTooltipText = (ParamIMEI, ParamProblems, ParamRef, ParamEstPrice) => {

    try {

        let problemsText = "";

        if (!ParamProblems || ParamProblems.length == 0 || ParamProblems == "")
            problemsText = "Aucun Problème";
        else
            ParamProblems.forEach(p => {
                if (ParamProblems.length > 1)
                    problemsText += (p.name + " (" + p.price + " DA)<br/>");
                else
                    problemsText += (p.name + " (" + ParamEstPrice + " DA)<br/>");
            });

        return ParamRef + "<br/><br/><br/>" + "Liste des Problems : <br/>" + problemsText;

    } catch (error) {

        console.log("Error while building tooltip text : " + error);

    }
}

const DeviceTypeToIcon = (ParamDeviceType, ParamIMEI, ParamProblems, ParamRef, ParamKey, ParamState, ParamEstPrice) => {

    let iconStyle = ItemStateToStyle(ParamState);
    const size = 30;

    switch (ParamDeviceType) {
        case "SMART_PHONE":
            return <FaMobileAlt key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        case "TABLET":
            return <FaTabletAlt key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        case "PHONE":
            return <FaPhone key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        case "LAPTOP":
            return <FaLaptop key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        case "PC":
            return <FaDesktop key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        case "AIO":
            return <FaTv key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
        default:
            return <FaQuestionCircle key={ParamKey} size={size} className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef, ParamEstPrice)} />
            break;
    }
}

const DeviceTypeToIconOnly = (ParamDeviceType, ParamKey, ParamState) => {

    let iconStyle = ItemStateToStyle(ParamState);
    const size = 36;

    switch (ParamDeviceType) {
        case "SMART_PHONE":
            return <FaMobileAlt key={ParamKey} size={size} className={iconStyle} />
            break;
        case "TABLET":
            return <FaTabletAlt key={ParamKey} size={size} className={iconStyle} />
            break;
        case "PHONE":
            return <FaPhone key={ParamKey} size={size} className={iconStyle} />
            break;
        case "LAPTOP":
            return <FaLaptop key={ParamKey} size={size} className={iconStyle} />
            break;
        case "PC":
            return <FaDesktop key={ParamKey} size={size} className={iconStyle} />
            break;
        case "AIO":
            return <FaTv key={ParamKey} size={size} className={iconStyle} />
            break;
        default:
            return <FaQuestionCircle key={ParamKey} size={size} className={iconStyle} />
            break;
    }
}

const ItemStateToStyle = (ParamState) => {

    let baseStyle = "inline mr-1 ";

    switch (ParamState) {
        case ItemRepairState.PENDING:
            return baseStyle + "text-blue-500"
        case ItemRepairState.DONE:
            return baseStyle + "text-green-500"
        case ItemRepairState.UNFIXABLE:
            return baseStyle + "text-red-500"
        case ItemRepairState.CANCELED:
            return baseStyle + "text-gray-600"
        default:
            return baseStyle + "text-gray-100"
    }
}

export default DeviceIconList