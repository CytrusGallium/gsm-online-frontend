import { React, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { GetBackEndUrl } from '../const';

const NetImage = (props) => {

    const [loaded, setLoaded] = useState(false);

    return (
        <div className={loaded ? "mx-2.5 h-32 w-32 my-6" : "grid h-screen place-items-center h-32 w-32 m-3 border-2 border-gray-300 rounded-2xl"}>
            <img src={GetBackEndUrl() + "/api/get-product-image?id=" + props.value._id} className="object-cover h-32 w-32 m-1.5 border-2 border-gray-300 rounded-2xl shadow-[0_15px_16px_-5px_rgba(0,0,0,0.9)] cursor-pointer hover:brightness-200" onLoad={() => setLoaded(true)} style={loaded ? {} : {display: 'none'}} onClick={props.onClick} draggable={false} />
            <p className='text-gray-100 text-ellipsis font-bold mt-2'>{props.value.name}</p>
            {!loaded && <HashLoader color='#AAAAAA'/>}
        </div>
    )
}

export default NetImage