import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const url = props.target;
            console.log("POST : " + url);

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='m-2 p-2 border border-gray-500 rounded text-gray-100 text-lg'>
            <input type="file" onChange={handleFileSelect} />
            <button type="submit">Upload File</button>
        </form>
    );
};

export default FileUpload