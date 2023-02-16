import React, { useEffect } from 'react';
import './GlowCard.scss';
import { gsap } from "gsap";
import chroma from "chroma-js";

const GlowCard = (props) => {

    useEffect(() => {
        console.log("EFFECT-ON-START");

        // ==============================================================
        document.querySelectorAll(".glow-card").forEach((button) => {
            console.log("!");

            const gradientElem = document.createElement("div");
            gradientElem.classList.add("gradient");

            button.appendChild(gradientElem);

            button.addEventListener("pointermove", (e) => {
                const rect = button.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                gsap.to(button, {
                    "--pointer-x": `${x}px`,
                    "--pointer-y": `${y}px`,
                    duration: 0.6,
                });
            });
        });
        // ============================================================================================

    }, []);

    return (
        <div>
            <button className="glow-card">
                <span>
                    {props.icon && <div>{props.icon}</div>}
                    <div>{props.label ? props.label : "Card"}</div>
                </span>
            </button>
        </div>
    )
}

export default GlowCard