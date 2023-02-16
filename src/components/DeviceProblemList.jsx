import React, { Component, useState } from 'react';
import ReactHotkeys from 'react-hot-keys';

export default class DeviceProblemList extends Component {

    constructor(props) {
        super(props);
        this.state = { problems: [{ key: 1, name: "", price: 0 }] };

        this.inputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 my-0.5 mx-0.5 p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
        this.buttonStyle = "bg-blue-500 hover:bg-blue-400 text-white font-bold border-b-4 border-blue-700 hover:border-blue-500 rounded";
    }

    OnAdd = (event) => {
        // event.preventDefault();
        let tmpState = this.state;
        tmpState.problems = [...this.state.problems, { key: this.state.problems.length + 1, name: "", price: 0 }];
        this.setState(tmpState);
        this.forceUpdate();
        this.HandleChange();
    }

    HandleChange = () => {
        this.props.onChange(this.state);
    }

    HandleNameOrPriceChange = ({ currentTarget: input }) => {

        // console.log("MARK 1");
        let tmpState = this.state;
        
        let result = null;
        
        tmpState.problems.forEach(element => {
            if (element.key == input.id)
            result = element;
        });

        if (result == null)
            return;
        
        // console.log("MARK 2 : " + result.key);

        if (input.name == "problem")
            result.name = input.value;
        else if (input.name == "price")
            result.price = input.value;

        tmpState.problems = [...this.state.problems];
        this.setState(tmpState);
        this.forceUpdate();
        this.HandleChange();
    }

    HandleDefaultProblemChange = ({ currentTarget: input }) => {
        let tmpState = this.state;
        tmpState.problems[0].name = input.value;

        this.setState(tmpState);
        this.forceUpdate();
        this.HandleChange();
    }

    OnF2Key = () => {
        this.OnAdd();
    }

    render() {
        return (
            <div className='border border-gray-500 m-2 p-2'>
                <ReactHotkeys
                    keyName="F2"
                    onKeyDown={this.OnF2Key.bind(this)}
                    filter={(event) => {
                        return true;
                    }}
                ></ReactHotkeys>
                {this.state.problems.length > 1 && <p className='text-gray-100 mb-1'>Liste Des Pannes</p>}
                {
                    this.state.problems.map(problem =>
                        <div className='flex-1 flex-nowrap flex-row' key={problem.key}>
                            {this.state.problems.length > 1 && <span className='text-gray-100'>{problem.key} </span>}
                            <input type="text" name="problem" id={problem.key} placeholder="Panne.." onChange={this.HandleNameOrPriceChange} className={this.inputStyle + ((this.state.problems.length > 1) ? " w-1/3" : " w-full")} autoComplete="off" />
                            {this.state.problems.length > 1 && <input type="number" name="price" id={problem.key} placeholder="Prix.." onChange={this.HandleNameOrPriceChange} className={this.inputStyle + " w-1/3"}  autoComplete="off"/>}
                        </div>
                    )
                }
                <br />
                {/* <div className='w-full cursor-pointer grid h-screen place-items-center h-16'> */}
                <div className='cursor-pointer flex flex-col items-center'>
                    <div onClick={this.OnAdd} className={this.buttonStyle + " w-8 h-8"}>+</div>
                    <div className="text-gray-500 text-sm">F2</div>
                </div>
            </div >
        )
    }
}