import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './static/normalize.css'
import './static/style.css'
import { MapAppController } from './components/App';
declare let module: any



ReactDOM.render(<MapAppController />,
    document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
