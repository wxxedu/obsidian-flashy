import * as React from 'react'

interface InfoViewParams {
    title: string,
    message: string,
}

export default function InfoView(params: InfoViewParams) {
  return (
    <div className="flashy-info">
        <h1 style={{textAlign: "center"}}>{params.title}</h1>
        <p>{params.message}</p>
    </div>
  )
}
