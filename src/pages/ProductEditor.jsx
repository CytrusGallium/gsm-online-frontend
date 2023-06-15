import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppData from '../App.json';
import { GetBackEndUrl } from '../const';
import axios from 'axios';
import FileSelectAndDrop from '../components/FileSelectAndDrop';
import { AwesomeButton } from 'react-awesome-button';
import ComputerSpecsEditor from '../components/ComputerSpecsEditor';
import { FaFacebook } from 'react-icons/fa';
import PostToFacebookPopup from '../components/PostToFacebookPopup';

const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2 w-4/5';
const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

const ProductEditor = () => {

    // Effect
    useEffect(() => {

        if (searchParams.get("id")) {
            GetProductFromDB(searchParams.get("id"));
            setTargetID(searchParams.get("id"));
        }

        getCategoryListFromDB();

    }, []);

    // Navigation
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [selectedFile, setSelectedFile] = useState("");
    const [productInfo, setProductInfo] = useState({ name: "", description: "", price: 0, altLangName: "", category: "", barcode: "", preparationDuration: 0 });
    const [imageURL, setImageURL] = useState();
    const [imageAvailable, setImageAvailable] = useState(false);
    const [changesAvailable, setChangesAvailable] = useState(false);
    const [categories, setCategories] = useState([]);
    const [targetID, setTargetID] = useState("");
    const [sellable, setSellable] = useState(true);
    const [buyable, setBuyable] = useState(true);
    const [computerSpecsID, setComputerSpecsID] = useState(null);
    const [computerSpecs, setComputerSpecs] = useState(null);
    const [currentSpecsToPost, setCurrentSpecsToPost] = useState(null);

    const handleChange = ({ currentTarget: input }) => {
        setProductInfo({ ...productInfo, [input.name]: input.value });
        setChangesAvailable(true);
    }

    const handleSellableChange = () => {
        setSellable(!sellable);
        setChangesAvailable(true);
    };

    const handleBuyableChange = () => {
        setBuyable(!buyable);
        setChangesAvailable(true);
    };

    // var imageAvailable = false;
    const handleFileSelect = (event) => {
        console.log("SELECTED FILE = " + event.target.files[0].name);
        setSelectedFile(event.target.files[0]);
        setImageURL(URL.createObjectURL(event.target.files[0]));
        setImageAvailable(true);
        setChangesAvailable(true);
    }

    const handleImageClear = () => {
        setSelectedFile("");
        setImageAvailable(false);
        setChangesAvailable(true);
    }

    const OnSubmit = async (event) => {

        event.preventDefault();

        if (targetID == "") {
            addProductToDB();
        }
        else {
            updateProductInDB();
        }
    }

    const addProductToDB = async () => {
        try {

            // Build form
            const formData = new FormData();
            formData.append("name", productInfo.name);
            formData.append("description", productInfo.description);
            formData.append("price", productInfo.price);
            formData.append("picture", selectedFile);
            formData.append("altLangName", productInfo.altLangName);
            formData.append("category", productInfo.category);
            formData.append("barcode", productInfo.barcode);
            formData.append("mizzappID", productInfo.mizzappID);
            formData.append("buyable", buyable);
            formData.append("sellable", sellable);
            formData.append("preparationDuration", productInfo.preparationDuration);

            // Add token
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Build Req/Res
            const response = await axios({
                method: "post",
                url: GetBackEndUrl() + "/api/new-product",
                data: formData,
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            }, {}, () => console.log("CALLBACK"));

            setChangesAvailable(false);

        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    const updateProductInDB = async () => {
        try {

            // Build form
            const formData = new FormData();
            formData.append("id", targetID);
            formData.append("name", productInfo.name);
            formData.append("description", productInfo.description);
            formData.append("price", productInfo.price);
            formData.append("picture", selectedFile);
            formData.append("altLangName", productInfo.altLangName);
            formData.append("category", productInfo.category);
            formData.append("barcode", productInfo.barcode);
            formData.append("mizzappID", productInfo.mizzappID);
            formData.append("buyable", buyable);
            formData.append("sellable", sellable);
            formData.append("preparationDuration", productInfo.preparationDuration);

            // Add token
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Build Req/Res
            const response = await axios({
                method: "post",
                url: GetBackEndUrl() + "/api/update-product",
                data: formData,
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            }, {}, () => console.log("CALLBACK"));

            setChangesAvailable(false);

        } catch (error) {
            console.log("ERROR : " + error);
        }
    }

    const getCategoryListFromDB = async () => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-category-list";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {
                // console.log("RESULT = " + JSON.stringify(res));
                setCategories(res.data);
                // this.setState({ isBusy: false });
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    const GetProductFromDB = async (ParamID) => {
        let res;

        try {

            // Build Req/Res
            var url = GetBackEndUrl() + "/api/get-product?id=" + ParamID;

            if (AppData.COMPUTER_SPECS_FLAG)
                url += "&computerSpecs=1";

            console.log("GET : " + url);
            res = await axios.get(url);

            if (res) {

                console.log("RESULT = " + JSON.stringify(res.data));

                setProductInfo({
                    name: res.data.name,
                    description: res.data.description,
                    altLangName: res.data.altLangName,
                    price: res.data.price,
                    category: res.data.category,
                    mizzappID: res.data.mizzappID,
                    preparationDuration: res.data.preparationDuration
                });

                setBuyable(res.data.buyable);
                setSellable(res.data.sellable);

                if (res.data.computerSpecsID) {
                    setComputerSpecsID(res.data.computerSpecsID);
                    // Build Req/Res
                    let url_2 = GetBackEndUrl() + "/api/computer-specs-by-id?id=" + res.data.computerSpecsID;
                    console.log("GET : " + url_2);
                    let res_2 = await axios.get(url_2);
                    console.log("DATA = " + JSON.stringify(res_2.data));
                    setComputerSpecs(res_2.data);
                }
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    return (
        <div>
            <br />
            <h1 className='text-gray-100 font-bold text-3xl'>{targetID == "" ? "Ajouter un nouveau produit" : "Editeur de produit"}</h1>
            <br />
            <form onSubmit={OnSubmit} className='flex flex-col items-center'>

                <input type="text" name="name" className={inputFieldStyle} placeholder="Nom du produit..." value={productInfo.name} onChange={handleChange} required />
                <br />

                <input type="text" name="altLangName" className={inputFieldStyle} placeholder="Nom alternatif..." value={productInfo.altLangName} onChange={handleChange} />
                <br />

                <textarea name="description" className={inputFieldStyle} value={productInfo.description} rows="2" placeholder="Description du produit..." onChange={handleChange} />
                <br />

                <label className="block text-sm font-medium text-gray-900 dark:text-white">Catégorie :</label>
                <select name="category" className={inputFieldStyle} value={productInfo.category} onChange={handleChange}>
                    <option value="NULL" defaultValue>Aucune</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <br />

                <label className="block text-sm font-medium text-gray-900 dark:text-white">Prix :</label>
                <input type="number" step="0.01" name="price" className={inputFieldStyle} value={productInfo.price} placeholder="Prix du produit..." onChange={handleChange} />
                <br />

                <label className="block text-sm font-medium text-gray-900 dark:text-white">Temps de Préparation :</label>
                <input type="number" step="1" name="preparationDuration" className={inputFieldStyle} value={productInfo.preparationDuration} placeholder="Temps de Préparation..." onChange={handleChange} />
                <br />

                {
                    AppData.PRODUCT_BARCODE_FLAG &&
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Codebar :</label>
                        <input type="text" name="barcode" className={inputFieldStyle} value={productInfo.barcode} placeholder="Codebar..." onChange={handleChange} />
                        <br />
                        <br />
                    </div>
                }

                {
                    AppData.MIZZAPP_FLAG &&
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Identifiant Mizzapp :</label>
                        <input type="text" name="mizzappID" className={inputFieldStyle} value={productInfo.mizzappID} placeholder="Identifiant Mizzapp..." onChange={handleChange} />
                        <br />
                        <br />
                    </div>
                }

                <div className='flex flex-row space-x-4 bg-gray-900 border border-gray-700 rounded-xl pb-1 pt-4 px-4'>
                    <label className='mb-4 text-gray-100 text-xl font-bold'><input type="checkbox" checked={buyable} onChange={handleBuyableChange} className='mx-1 w-4 h-4' />Achetable</label>
                    <label className='mb-4 text-gray-100 text-xl font-bold'><input type="checkbox" checked={sellable} onChange={handleSellableChange} className='mx-1 w-4 h-4' />Vendable</label>
                </div>
                <br />

                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image :</label>
                {!imageAvailable && <FileSelectAndDrop name="picture" onChange={handleFileSelect} />}
                {imageAvailable && <img src={imageURL} alt="preview" className="object-cover h-64 w-64 m-auto border-2 border-gray-300 rounded-2xl" />}
                {imageAvailable && <div className='text-xl text-gray-500 font-bold border-2 border-gray-500 rounded-2xl w-64 m-auto mt-1 hover:bg-gray-500 hover:text-gray-100' onClick={handleImageClear}>X</div>}

                <br />
                <br />

                {/* {AppData.COMPUTER_SPECS_FLAG && <ComputerSpecsEditor value={computerSpecs} />} */}

                {/* Facebook */}
                <br />
                {AppData.SHARE_PRODUCT_ON_FACEBOOK_FLAG && <AwesomeButton type='primary' before={<FaFacebook />} onPress={() => { setCurrentSpecsToPost(computerSpecs); }}>Partager</AwesomeButton>}
                {currentSpecsToPost &&
                    <PostToFacebookPopup value={currentSpecsToPost} isOpen={true} onClose={() => { setCurrentSpecsToPost(null); }} />
                }
                <br />

                <div>
                    {changesAvailable && <button type="submit" className={buttonStyle}>Enregistrer</button>}
                </div>
                <br />

                <br />
            </form>
        </div>
    )
}

export default ProductEditor