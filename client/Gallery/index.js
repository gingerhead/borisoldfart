import React, {Component} from 'react';
import cn from 'classnames';
import ReactSwipe from 'react-swipe';

import './index.sass';

const context = require.context('./images', false, /^\.\/.+\.jpg|JPG|gif/i);

function imagesLoaded(parentNode) {
    const imgElements = [...parentNode.querySelectorAll("img")];
    for (let i = 0; i < imgElements.length; i += 1) {
        const img = imgElements[i];
        if (!img.complete) {
            return false;
        }
    }
    return true;
}

export default class Gallery extends Component {
    componentDidMount() {
        this.waitForUpload();
    }

    state = {
        allImagesUploaded: false
    };

    waitForUpload = () => {
        console.log(imagesLoaded(this.galleryElement));
        if (!imagesLoaded(this.galleryElement)) {
            setTimeout(this.waitForUpload, 100);
        } else {
            this.setState({allImagesUploaded: true});
        }
    };

    renderImage(imgUrl, index) {
        return (
            <div className='slide' key={index} >
                <div className='background' style={{backgroundImage: `url(${imgUrl})`}} />
            </div>
        )
    }

    rImages() {
        return context.keys().map((img, index) => {
            return this.renderImage(context(img), index);
        })
    }

    next = () => {
        this.reactSwipe.next();
    };

    prev = () => {
        this.reactSwipe.prev();
    };

    render() {
        return (
            <div ref={(node) => this.galleryElement = node} className='gallery'>
                <ReactSwipe ref={reactSwipe => this.reactSwipe = reactSwipe}>
                    {this.rImages()}
                </ReactSwipe>
                <div className='next' onClick={this.next} />
                <div className='prev' onClick={this.prev} />
            </div>
        )
    }
}
