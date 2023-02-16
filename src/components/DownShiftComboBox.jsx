import * as React from 'react'
import { useState, useEffect } from 'react'
import { render } from 'react-dom'
import Downshift from 'downshift'

const DownShiftComboBox = (props) => {

    // useEffect(() => {

    //     if (props.initialSelection) {
    //         console.log("INIT SELECT = " + JSON.stringify(props.initialSelection));
    //         setValue(props.initialSelection);
    //     }

    // }, []);

    // const [value, setValue] = useState({key:"", value:""});

    return (
        <div className='text-white mr-1'>
            <Downshift
                // selectedItem={value}
                onChange={selection => {
                    // console.log("SELECTION = " + JSON.stringify(selection));
                    // setValue(selection);
                    if (props.onSelection)
                        props.onSelection(selection);
                }
                }
                itemToString={item => (item ? item.value : '')}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                    getRootProps,
                }) => (
                    <div>
                        {props.label && <label {...getLabelProps()} className='mx-2 font-bold'>Enter a fruit</label>}
                        <div
                            style={{ display: 'inline-block' }}
                            {...getRootProps({}, { suppressRefError: true })}
                        >
                            <input {...getInputProps()} className='p-1 rounded-lg bg-gray-700' placeholder={props.placeholder && props.placeholder} />
                        </div>
                        {props.items &&
                            <div className='flex flex-col items-center'>
                                <ul {...getMenuProps()} className='absolute w-48 ml-28 mr-2 mt-1 bg-gray-700'>
                                    {isOpen
                                        ? props.items
                                            .filter(item => !inputValue || item.value.includes(inputValue))
                                            .map((item, index) => (
                                                <li className='p-1 m-1 border-2 border-gray-500 rounded-lg cursor-pointer'
                                                    {...getItemProps({
                                                        key: item.key,
                                                        index,
                                                        item,
                                                        style: {
                                                            backgroundColor: highlightedIndex === index ? 'MidnightBlue' : 'LightSlateGray',
                                                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                        },
                                                    })}
                                                >
                                                    {item.value}
                                                </li>
                                            ))
                                        : null}
                                </ul>
                            </div>}
                    </div>
                )}
            </Downshift>
        </div>
    )
}

export default DownShiftComboBox