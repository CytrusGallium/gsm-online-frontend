import React, { Component } from 'react';
import { PulseLoader } from 'react-spinners';
import axios from "axios";
import GetBackEndUrl from '../const';

export default class RepairOrderID extends Component {

    constructor(props) {
        super(props);
        this.state = { id: "" };
    }

    componentDidMount() {
        // console.log("MOUNT");
        this.GetIDFromDB();
    }

    render() {
        return (
            <div className='text-gray-100 mt-2'>{this.state.id == "" ? <PulseLoader color='#AAAAAA' /> : "Identifiant " + this.state.id}</div>
        )
    }

    async GetIDFromDB() {
        let res;

        try {

            // Build Req/Res
            const url = GetBackEndUrl() + "/api/get-next-ro-id";
            res = await axios.get(url);

            if (res) {
                this.UpdateID(res.data.id);
            }

        } catch (error) {
            console.log("ERROR : " + error);

            if (error.response && error.response.status >= 400 && error.response.status <= 500) {

                console.log(error.response.data);

            }
        }
    }

    UpdateID(ParamID) {
        let result = '' + ParamID;

        for (let index = result.length; index < 8; index++) {
            result = '0' + result;
        }

        result = this.props.YearAndMonth + "-" + result;

        this.setState({ id: result });
        this.props.OnChange(result);
    }
}