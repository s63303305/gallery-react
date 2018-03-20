import React, { Component } from 'react';
import ImageFigure from '../imageFigure/ImageFigure';
//import logo from './logo.svg';
import './App.css';

var imageDatas = require('../../data/imageDatas.json');

class App extends Component {
  render() { 	
    return (
      <div className="App">
      	<ImageFigure imageArr={imageDatas}  />
      </div>
    );
  }
}

export default App;
