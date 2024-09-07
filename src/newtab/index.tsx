/* global document */

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/styles.css';

const root = ReactDOM.createRoot(document.getElementById('display-container')!);
root.render(<div className="bg-gray-200">Test</div>);
