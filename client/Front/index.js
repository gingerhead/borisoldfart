import React, { Component } from 'react';

import './index.sass'

import Typed from 'typed.js';
import Gallery from '../Gallery';
import ModelEditorViewer from '3d';

export default class Front extends Component {
    state = {
        showGallery: false
    }

    componentDidMount() {
        const typed = new Typed(this.typed, {
            //strings: ['Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. \nLorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. \n В то время некий безымянный печатник создал большую коллекцию размеров \n и форм шрифтов, используя Lorem Ipsum для распечатки образцов. \nLorem Ipsum не только успешно пережил без заметных изменений пять веков,\n но и перешагнул в электронный дизайн.\n Его популяризации в новое время послужили публикация листов Letraset с\n образцами Lorem Ipsum в 60-х годах и, в более недавнее время, \nпрограммы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется \n Lorem Ipsum.', 'HAPPY B-DAY MAZAFAKA', '.'],
            //strings: ['npm install^5000\n `installing components...` ^1000\n `Fetching from source...`'],
            strings: ['Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров \n и форм шрифтов, используя Lorem Ipsum для распечатки образцов. \nLorem Ipsum не только успешно пережил без заметных изменений пять веков,\n но и перешагнул в электронный дизайн.\n Его популяризации в новое время послужили публикация листов Letraset с\n образцами Lorem Ipsum в 60-х годах и, в более недавнее время, \nпрограммы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется \n Lorem Ipsum.', 'HAPPY B-DAY MAZAFAKA', '.'],
            typeSpeed: 50,
            backSpeed: 0,
            backDelay: 500,
            startDelay: 1000,
            loop: false,
            onComplete: function(self) { this.viewer = new ModelEditorViewer(); },
        });
    }

    render() {
        return (
            <div className='front'>
                {this.state.showGallery && <Gallery />}
                <div
                    id='3d'
                    className={'3d'}
                    onClick={() => this.setState({showGallery: true})}
                    ref={(container) => { this.container = container; }}/>
                <div className='text' onClick={() => {}}>
                    <span> > </span>
                    <span className='hb-string' style={{width: '100vw'}}>
                        <span ref={node => this.typed = node} id='typed'></span>
                    </span>
                </div>
            </div>
        )
    }
}