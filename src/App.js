import React, { Component } from 'react';
import logo from './logo.svg';
import Lightbox from "react-images";
import './App.css';
var Loader = require('react-loader');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      images: [],
      loaded: false,
      count: 4,
      currentImage: 0,
      imagesToWatch: []
    }
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoPrevLightboxImage = this.gotoPrevLightboxImage.bind(this);
    this.gotoNextLightboxImage = this.gotoNextLightboxImage.bind(this);
  }

  loadShibe(){
    this.setState({...this.state, loaded: false})
    fetch('https://cors-anywhere.herokuapp.com/http://shibe.online/api/shibes?count=' + this.state.count + '&urls=true&httpsUrls=true')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      let rows = Math.ceil(json.length / 4);
      this.setState({...this.state, images: json, loaded: true, rows: rows});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  changeCount(count){
    console.log(count);
    if(count){
      if(count > 0 && count < 101){
        this.setState({...this.state, count: count});
      }
      else if(count > 100)
        this.setState({...this.state, count: 100});
      else if(count < 1)
        this.setState({...this.state, count: 1});
    }
    else
      this.setState({...this.state, count: ""});
    
  }

  open(index) {
    let arr = [];
    this.state.images.forEach(elem => {
        arr.push({ src: elem });
    });
    this.setState({ ...this.state, currentImage: index, lightboxIsOpen: true, imagesToWatch: arr });
  }

  closeLightbox() {
      this.setState({ ...this.state, currentImage: 0, lightboxIsOpen: false });
  }

  gotoPrevLightboxImage() {
      this.setState({ ...this.state, currentImage: this.state.currentImage - 1 })
  }

  gotoNextLightboxImage() {
      this.setState({ ...this.state, currentImage: this.state.currentImage + 1 })
  }

  componentDidMount(){
    this.loadShibe();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="header">
            <span className="header-text">Сиба-ину</span>
            <div style={{
              display: "flex", flexDirection: "row", alignItems: "stretch", marginRight: 10
            }}>
              <span style={{
                fontSize: 15, marginRight: 10, display: "flex", alignItems: "center"
              }}>Количество собачек</span>
              <input type="text" value={this.state.count} onChange={(e)=>this.changeCount(e.target.value)} />
              <button className="btn-load" onClick={()=>this.loadShibe()}>Загрузить</button>
            </div>
            
          </div>
          <Loader loaded={this.state.loaded}>
                {this.state.images.length > 0 &&
                <div style={{gridTemplateRows: "repeat(" + this.state.rows + ", 45vh)"}} className="container">
                  {this.state.images.map((item, index)=>{
                    return (
                      <div 
                        className="item" 
                        key={index} 
                        style={{width: "95%", height: "auto", backgroundSize: "cover", backgroundImage: "url(" + item + ")"}}
                        onClick={()=>this.open(index)}
                      ></div>
                    )
                  })}
                  </div>}
            </Loader>
          
        </header>
        <Lightbox
          backdropClosesModal={true}
            images={this.state.imagesToWatch}
            isOpen={this.state.lightboxIsOpen}
            onClickPrev={this.gotoPrevLightboxImage}
            onClickNext={this.gotoNextLightboxImage}
            onClose={this.closeLightbox}
            currentImage={this.state.currentImage}
            imageCountSeparator=" из "
        />
      </div>
    );
  }
}

export default App;
