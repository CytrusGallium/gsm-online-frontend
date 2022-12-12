import React from 'react';

const ProblemPriceGrid = (props) => {
    return (
        <div className='font-bold m-1'>
            {props.problems.map(p =>
                <div key={p.key} style={{ display: "grid", gridTemplateColumns: "75% 25%" }}>
                    <span style={{ border: "solid 1px black" }}>{p.name}</span>
                    <span style={{ border: "solid 1px black" }}>{p.price} DA</span>
                </div>
            )}
        </div>
    )
}

export default ProblemPriceGrid