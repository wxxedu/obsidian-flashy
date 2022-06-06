import * as React from "react";

interface ButtonParams {
    title: string,
    color?: string,
    backgroundColor?: string,
    borderRadius?: number,
    padding?: number,
    onClick?: React.MouseEventHandler,
    width?: number,
}

export default function Button(params: ButtonParams) {
    let style = { 
        backgroundColor: params.backgroundColor ?? 'black', 
        color: params.color ?? 'white', 
        borderRadius: params.borderRadius ?? 5,
        padding: params.padding ?? 5,
        width: params.width,
        maxWidth: params.width,
        minWidth: params.width,
        fontWeight: 'bold',
        fontFamily: 'cmu-sans-serif',
    };
    return (
        <button className="flashy-button" onClick={params.onClick} style={style} >
        {params.title}
        </button>
    )
}