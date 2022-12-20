import React from 'react';
import { FaMobileAlt, FaPhone, FaTabletAlt, FaQuestionCircle, FaLaptop, FaDesktop, FaTv } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import ItemRepairState from '../Enums';

const DeviceIconList = (props) => {
    return (
        <div>
            {props.value.map(i => DeviceTypeToIcon(i.deviceType, i.imei, i.problems, i.ref, i.key, i.state))}<ReactTooltip multiline={true} />
        </div>
    )
}

const BuildTooltipText = (ParamIMEI, ParamProblems, ParamRef) => {

    try {

        let problemsText = "";

        ParamProblems.forEach(p => {
            problemsText += (p.name + " (" + p.price + " DA)");
        });

        return ParamRef + "<br/><br/><br/>" + "Liste des Problems : <br/>" + problemsText;

    } catch (error) {

        console.log("Error while building tooltip text : " + error);

    }
}

const DeviceTypeToIcon = (ParamDeviceType, ParamIMEI, ParamProblems, ParamRef, ParamKey, ParamState) => {

    let iconStyle = ItemStateToStyle(ParamState);

    switch (ParamDeviceType) {
        case "SMART_PHONE":
            return <FaMobileAlt key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "TABLET":
            return <FaTabletAlt key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "PHONE":
            return <FaPhone key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "LAPTOP":
            return <FaLaptop key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "PC":
            return <FaDesktop key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "AIO":
            return <FaTv key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        default:
            return <FaQuestionCircle key={ParamKey} size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
    }
}

const ItemStateToStyle = (ParamState) => {

    switch (ParamState) {
        case ItemRepairState.PENDING:
            return "inline text-blue-500";
        case ItemRepairState.DONE:
            return "inline text-green-500";
        case ItemRepairState.UNFIXABLE:
            return "inline text-red-500";
        case ItemRepairState.CANCELED:
            return "inline text-gray-600";
        default:
            return "inline text-gray-100";
    }
}

export default DeviceIconList