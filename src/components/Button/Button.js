import React from 'react';
import './Button.scss';

export default function Button({ text, onClick }) {
  // TODO: also make it possible to return link styled like a button
  return (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  );
}
