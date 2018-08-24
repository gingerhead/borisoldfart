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
        this.typedFirst = new Typed(this.typedNode, {
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
                <div
                    id='3d'
                    className={cn('mount-3d', {'hidden': this.state.showGallery})}
                    onClick={() => {
                        this.setState({showGallery: true});
                        this.typedSecond.destroy();
                    }}
                    ref={(container) => { this.container = container; }}/>
                <div className={cn('text', {'hidden': this.state.showGallery})} onClick={once((e) => {
                    this.typedFirst.destroy();
                    this.typedSecond = new Typed(this.typedNode, {
                        strings: ['CLICK TO PROCEED'],
                        typeSpeed: 20,
                        backSpeed: 5,
                        backDelay: 2500,
                        startDelay: 0,
                        loop: false,
                        fadeOut: true,
                        onComplete: function(self) {
                            this.viewer = new ModelEditorViewer();
                        }
                    });
                })}>
                    <span> > </span>
                    <span className='hb-string' style={{width: '100vw'}}>
                        <span ref={node => this.typedNode = node} id='typed' />
                    </span>
                </div>
                {this.state.showGallery && <Gallery />}
            </div>
        )
    }
}