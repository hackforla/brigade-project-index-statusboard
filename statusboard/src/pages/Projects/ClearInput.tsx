/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import $ from 'jquery';
import { Button } from '../../components';

export default function ClearInput({
  inputId,
  setInputFunc,
}: InputFuncType): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return (
    <Button
      text="X"
      className="clear-button"
      onClick={() => {
        $(`#${inputId}:text`).val("");
        setInputFunc();
        console.log('trying 3', $('#fred:text').val());
      }}
    />
  );
}

type InputFuncType = {
  inputId: string;
  setInputFunc: () => void;
};
