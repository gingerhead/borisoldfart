import React, { Component } from 'react';

import './index.sass'

import Typed from 'typed.js';
import Gallery from '../Gallery';

function prettyLog(str) {
    console.log('%c ' + str, 'color: green; font-weight: bold;');
}

export default class Front extends Component {
    componentDidMount() {
        console.log(this.strings.innerText);
        const typed = new Typed(this.typed, {
            strings: [this.strings.innerText],
            typeSpeed: 50,
            backSpeed: 0,
            backDelay: 500,
            startDelay: 1000,
            loop: false
        });
    }

    render() {
        return (
            <div className='front'>
                <div style={{display: 'none'}} ref={node => this.strings = node} id='typed-strings'>BORIS OLD FART AHAHAHAHAH</div>
                <div className='hb-string'>
                    <span ref={node => this.typed = node} id='typed'></span>
                </div>
                <Gallery />
            </div>
        )
    }
}