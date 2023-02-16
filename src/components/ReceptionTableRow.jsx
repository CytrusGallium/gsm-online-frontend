import React, { useState, useEffect } from 'react'
import DownShiftComboBox from './DownShiftComboBox'

const ReceptionTableRow = (props) => {

    const [product, setProduct] = useState({});
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [total, setTotal] = useState(0);

    const handleProductChange = (ParamSelection) => {
        setProduct(ParamSelection);
        DoOnChange({ key: props.id, product: ParamSelection, amount: amount, price: price, total: total });
    }

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
        setTotal(price * event.target.value);
        DoOnChange({ key: props.id, product: product, amount: event.target.value, price: price, total: price * event.target.value });
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setTotal(amount * event.target.value);
        DoOnChange({ key: props.id, product: product, amount: amount, price: event.target.value, total: amount * event.target.value });
    }

    const DoOnChange = (ParamValue) => {
        if (props.onChange) {
            // let result = { product: product, amount: amount, price: price, total: total };
            let result = ParamValue;
            props.onChange(result);
        }
    }

    return (
        <div className='flex flex-row'>
            <DownShiftComboBox placeholder='Produit...' items={props.products} onSelection={handleProductChange} />
            <input className='inline p-1 text-gray-100 bg-gray-700 rounded-lg mr-1' type='number' name='amount' value={amount} placeholder='Quantité...' onChange={handleAmountChange} />
            <input className='inline p-1 text-gray-100 bg-gray-700 rounded-lg mr-1' type='number' name='price' value={price} placeholder='Prix...' onChange={handlePriceChange} />
            <input className='inline p-1 text-gray-100 bg-gray-700 rounded-lg mr-1' type='number' name='total' placeholder='Total...' value={total} readOnly />
        </div>
    )
}

export default ReceptionTableRow