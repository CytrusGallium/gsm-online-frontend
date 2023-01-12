import React from 'react';
import { useState } from 'react';
import { GetBackEndUrl } from '../const';
import axios from 'axios';
import FileSelectAndDrop from '../components/FileSelectAndDrop';
import { AwesomeButton } from 'react-awesome-button';

const inputFieldStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2';
const buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mt-2";

const CategoryEditor = () => {
    
    const [selectedFile, setSelectedFile] = useState("");
    const [productInfo, setProductInfo] = useState({ name: "", description: "" });
    const [imageURL, setImageURL] = useState();
    const [imageAvailable, setImageAvailable] = useState(false);
    const [changesAvailable, setChangesAvailable] = useState(false);

    const handleChange = ({ currentTarget: input }) => {
        setProductInfo({ ...productInfo, [input.name]: input.value });
        setChangesAvailable(true);
    }
    
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

        try {

            // Build form
            const formData = new FormData();
            formData.append("name", productInfo.name);
            formData.append("description", productInfo.description);
            formData.append("picture", selectedFile);

            // Add token
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Build Req/Res
            const response = await axios({
                method: "post",
                url: GetBackEndUrl() + "/api/new-category",
                data: formData,
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            }, {}, () => console.log("CALLBACK"));

            setChangesAvailable(false);

        } catch (error) {
            console.log("ERROR : " + error);
        }

    }

    return (
        <div>
            <form onSubmit={OnSubmit} className='flex flex-col'>
                <div>
                    <input type="text" name="name" className={inputFieldStyle} placeholder="Nom de la catégorie..." value={productInfo.name} onChange={handleChange} required />
                </div>
                <br />
                <div>
                    <textarea name="description" className={inputFieldStyle} value={productInfo.description} rows="2" placeholder="Description de la catégorie..." onChange={handleChange} />
                </div>
                <br />
                <br />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image :</label>
                {!imageAvailable && <FileSelectAndDrop name="picture" onChange={handleFileSelect} />}
                {imageAvailable && <img src={imageURL} alt="preview" className="object-cover h-64 w-64 m-auto border-2 border-gray-300 rounded-2xl" />}
                {imageAvailable && <div className='text-xl text-gray-500 font-bold border-2 border-gray-500 rounded-2xl w-64 m-auto mt-1 hover:bg-gray-500 hover:text-gray-100' onClick={handleImageClear}>X</div>}
                <div>
                    {changesAvailable && <button type="submit" className={buttonStyle}>Enregistrer</button>}
                </div>
            </form>
        </div>
    )
}

export default CategoryEditor