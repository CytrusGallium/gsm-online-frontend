import React from 'react';
import { FaMobileAlt, FaPhone, FaTabletAlt, FaQuestionCircle, FaLaptop, FaDesktop, FaTv } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

const iconStyle = "inline";

const DeviceIconList = (props) => {
    return (
        <div>{props.value.map(i => DeviceTypeToIcon(i.deviceType, i.imei, i.problems, i.ref))}<ReactTooltip multiline={true} /></div>
    )
}

const BuildTooltipText = (ParamIMEI, ParamProblems, ParamRef) => {

    let problemsText = "";

    ParamProblems.forEach(p => {
        problemsText += (p.name + " (" + p.price + " DA)");
    });

    return ParamRef + "<br/><br/><br/>" + "Liste des Problems : <br/>" + problemsText;
}

const DeviceTypeToIcon = (ParamDeviceType, ParamIMEI, ParamProblems, ParamRef) => {
    switch (ParamDeviceType) {
        case "SMART_PHONE":
            return <FaMobileAlt size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "TABLET":
            return <FaTabletAlt size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "PHONE":
            return <FaPhone size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "LAPTOP":
            return <FaLaptop size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "PC":
            return <FaDesktop size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        case "AIO":
            return <FaTv size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
        default:
            return <FaQuestionCircle size='24' className={iconStyle} data-tip={BuildTooltipText(ParamIMEI, ParamProblems, ParamRef)} />
            break;
    }
}

export default DeviceIconList