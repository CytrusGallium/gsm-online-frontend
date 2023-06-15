import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { AwesomeButtonProgress } from 'react-awesome-button';
import { FaTimesCircle } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import { GetBackEndUrl } from '../const';

const PostToFacebookPopup = (props) => {

    const textAreaStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2 w-full';

    const [postContent, setPostContent] = useState("");

    useEffect(() => {
        // setPostContent(JSON.stringify(props.value));
        const v = props.value;

        var result = "💻 " + v.brand + " " + v.model + " " + v.screenSizeInInch + " Pouces" + '\n' + '\n';
        result += v.cpu + " 🌬" + '\n';
        result += v.coreCount + " Core 😎 / " + v.threadCount + " Thread 🚀🚀🚀🚀" + '\n';
        result += CacheInKbToReadable(v.cpuCacheInKb) + " Cache" + '\n';
        result += "📏📏 " + RamInMbToReadable(v.ramInMb) + " " + v.ramType + '\n';
        result += "💽 " + Math.round(v.storageCapacityInGb) + " Gb " + v.storageType + '\n';
        result += "🎮 " + v.gpu + '\n';
        result += '\n';
        result += "Etat " + v.stateScore + "/10 👌" + '\n';
        result += "💰Prix : " + v.price + " DA💰" + '\n';

        setPostContent(result);
    }, []);

    const CacheInKbToReadable = (ParamCacheInKb) => {
        let cacheInKb = Number(ParamCacheInKb);

        if (cacheInKb >= 1024)
            return (cacheInKb / 1024) + " Mb";
        else
            return cacheInKb + " Kb";
    }

    const RamInMbToReadable = (ParamRamInMb) => {
        let ramInMb = Number(ParamRamInMb);

        if (ramInMb >= 1024)
            return Math.round(ramInMb / 1024) + " Gb";
        else
            return ramInMb + " Mb";
    }

    const CloseModal = () => {
        props.onClose();
    }

    const PostToFacebook = async (ParamPostContent) => {

        try {

            let contentToPost = { content: ParamPostContent };
            let url = GetBackEndUrl() + "/api/post-on-facebook";
            let res = await axios.post(url, contentToPost);

        } catch (error) {
            console.log("ERROR : " + error);
        }

    }

    return (
        <div>
            <Popup
                open={props.isOpen}
                modal
                closeOnDocumentClick
                onClose={() => { CloseModal(); }}
            >
                <div className="modal bg-gray-900 text-gray-100 p-2">
                    <button className="close" onClick={() => { CloseModal(); }}>
                        <FaTimesCircle />
                    </button>
                    <div className="header"> Partagé sur Facebook </div>
                    <div className="content flex flex-col items-center">
                        <br />
                        <textarea name="note" className={textAreaStyle} value={postContent} rows="16" placeholder="Publication..." onChange={(e) => { setPostContent(e.target.value) }} />
                        <br />
                        <AwesomeButtonProgress type="primary" onPress={async (element, next) => {
                            await PostToFacebook(postContent);
                            next();
                        }}><div className='text-xl'>Partager</div></AwesomeButtonProgress>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default PostToFacebookPopup