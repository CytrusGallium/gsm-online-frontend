import React, { useState, useEffect } from 'react'
import ReceptionTableRow from './ReceptionTableRow'
import { AwesomeButton } from 'react-awesome-button';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { GetBackEndUrl } from '../const';

const ReceptionTable = (props) => {

    useEffect(() => {

        GetProductListFromDb();

    }, []);

    const [products, setProducts] = useState([]);
    const [rows, SetRows] = useState({});
    const [counter, SetCounter] = useState(1);

    const labelStyle = 'inline bg-gray-700 text-gray-100 w-48 rounded-lg p-1 border-2 border-gray-500';

    const handleAddRowOnClick = () => {
        var tmpRows = rows;
        tmpRows[counter] = { key: counter, product: "", amount: 0, price: 0, total: 0 };
        SetRows(tmpRows);
        SetCounter(counter + 1);
    }

    const GetProductListFromDb = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product-list?buyable=true";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("BUYABLE PRODUCTS = " + JSON.stringify(res.data));

                // Build Combobox items
                let tmpProducts = [];
                res.data.forEach(p => {
                    tmpProducts.push({ key: p._id, value: p.name });
                });
                setProducts(tmpProducts);

                // setReceptionList(res.data);
                // UpdateTableData(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const handleRowOnChange = (ParamValue) => {
        let tmpRows = rows;
        tmpRows[ParamValue.key] = ParamValue;
        SetRows(tmpRows);
        // console.log("TABLE = " + JSON.stringify(tmpRows));

        if (props.onChange)
            props.onChange(tmpRows);
    }

    return (
        <div className='mx-2'>
            <div className='flex flex-row mb-1'>
                <div className={labelStyle}>Produit</div>
                <div className={labelStyle}>Qte</div>
                <div className={labelStyle}>Prix</div>
                <div className={labelStyle}>Total</div>
            </div>
            {Object.keys(rows).map((k) =>
                <ReceptionTableRow key={rows[k].key} id={rows[k].key} products={products} onChange={handleRowOnChange} />
            )}
            <br />
            <AwesomeButton before={<FaPlus />} onPress={handleAddRowOnClick}><span className='text-sm'>Ajouter Un Produit</span></AwesomeButton>
        </div>
    )
}

export default ReceptionTable