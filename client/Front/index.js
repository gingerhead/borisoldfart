import React, { Component } from 'react';
import cn from 'classnames';
import once from 'lodash/once';

import './index.sass'

import Typed from 'typed.js';
import Gallery from '../Gallery';
import ModelEditorViewer from '3d';

export default class Front extends Component {
    state = {
        showGallery: false
    };

    componentDidMount() {
        new Typed(this.typedNode, {
            strings: ['BORIS OLD FART AHAHAHA', 'HAPPY B-DAY MAZAFAKA', require('./data/congratulations').default],
            typeSpeed: 20,
            backSpeed: 5,
            backDelay: 2500,
            startDelay: 1000,
            loop: false,
            fadeOut: true,
        });
    }

    render() {
        return (
            <div className='front'>
                <div className={cn('text', {'hidden': this.state.showGallery})}>
                    <span> > </span>
                    <span className='hb-string' style={{width: '100vw'}}>
                        <span ref={node => this.typedNode = node} id='typed' />
                    </span>
                </div>
            </div>
        )
    }
}
