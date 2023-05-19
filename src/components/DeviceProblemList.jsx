import React, { useState, useEffect } from 'react';
import ReactHotkeys from 'react-hot-keys';

const DeviceProblemList = (props) => {

    useEffect(() => {

        if (props.value)
            setProblems(props.value);

    }, [props.value]);

    const [problems, setProblems] = useState([{ key: 1, name: "", price: 0 }]);

    const inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0.5 mx-0.5 p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
    const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold border-b-4 border-blue-700 hover:border-blue-500 rounded";

    const HandleNameOrPriceChange = ({ currentTarget: input }) => {
        let tmpProblems = problems;

        let result = null;

        tmpProblems.forEach(element => {
            if (element.key == input.id)
                result = element;
        });

        if (result == null)
            return;

        if (input.name == "problem")
            result.name = input.value;
        else if (input.name == "price")
            result.price = input.value;

        tmpProblems = [...problems];
        setProblems(tmpProblems);
        HandleChange();
    }

    const HandleChange = (ParamProblems) => {

        if (!props.onChange)
            return;

        if (ParamProblems)
            props.onChange(ParamProblems);
        else
            props.onChange(problems);
    }

    const OnAdd = () => {
        let tmpProblems = problems;
        tmpProblems = [...problems, { key: problems.length + 1, name: "", price: 0 }];
        setProblems(tmpProblems);
        HandleChange(tmpProblems);
    }

    return (
        <div className='border border-gray-500 m-2 p-2 rounded-lg'>

            <ReactHotkeys
                keyName="F2"
                onKeyDown={OnAdd}
                filter={(event) => {
                    return true;
                }}
            ></ReactHotkeys>

            {problems.length > 1 && <p className='text-gray-100 mb-1'>Liste Des Pannes</p>}
            {
                problems.map(problem =>
                    <div className='flex-1 flex-nowrap flex-row' key={problem.key}>
                        {problems.length > 1 && <span className='text-gray-100'>{problem.key} </span>}
                        <input type="text" name="problem" id={problem.key} placeholder="Panne.." onChange={HandleNameOrPriceChange} className={inputStyle + ((problems.length > 1) ? " w-1/3" : " w-full")} autoComplete="off" value={problem.name} />
                        {problems.length > 1 && <input type="number" name="price" id={problem.key} placeholder="Prix.." onChange={HandleNameOrPriceChange} className={inputStyle + " w-1/3"} autoComplete="off" value={problem.price} />}
                    </div>
                )
            }
            <br />

            {/* Button to add new problem */}
            <div className='cursor-pointer flex flex-col items-center'>
                <div onClick={OnAdd} className={buttonStyle + " w-8 h-8"}>+</div>
                <div className="text-gray-500 text-sm">F2</div>
            </div>
        </div>
    )
}

export default DeviceProblemList