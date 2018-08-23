import React, { Component } from 'react';

import './index.sass'

import Typed from 'typed.js';
import Gallery from '../Gallery';
import ModelEditorViewer from '3d';

function prettyLog(str) {
    console.log('%c ' + str, 'color: green; font-weight: bold;');
}

export default class Front extends Component {
    componentDidMount() {
        const typed = new Typed(this.typed, {
            strings: ['BORIS OLD FART AHAHAHAHAH', 'HAPPY B-DAY MAZAFAKA', '.'],
            typeSpeed: 50,
            backSpeed: 0,
            backDelay: 500,
            startDelay: 1000,
            loop: false
        });
        this.viewer = new ModelEditorViewer();
    }

    render() {
        return (
            <div className='front'>
                {/*<Gallery />*/}
                <div
                    id='3d'
                    className={'3d'}
                    ref={(container) => { this.container = container; }}/>
                <div className='text' onClick={() => {}}>
                    <span> > </span>
                    <span className='hb-string'>
                        <span ref={node => this.typed = node} id='typed'></span>
                    </span>
                </div>
            </div>
        )
    }
}