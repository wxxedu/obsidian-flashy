import * as React from 'react';
import { IconType } from 'react-icons';

interface IconButtonParams {
    icon: IconType;
    onClick?: React.MouseEventHandler;
}

export default function IconButton(params: IconButtonParams) {
  return (
    <button className="flashy-icon-button" onClick={params.onClick}>
        <params.icon />
    </button>
  )
}
