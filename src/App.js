import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch'

class App extends Component {

    constructor() {
        super();

        this.state = {
            sentenceHistory: [],
            reversedSentence: null
        };

        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onFormSubmit(sentence) {
        fetch('http://localhost:8080/reverse', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sentence: sentence
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({reversedSentence: responseJson});
                this.updateSentenceHistory()
            })
    }

    componentDidMount() {
        this.updateSentenceHistory()
    }

    updateSentenceHistory() {
        fetch(`http://localhost:8080/reverse-history`)
            .then(result => result.json())
            .then(sentences => this.setState({sentenceHistory: sentences}))
    }

    render() {
        return (
            <div className="App pure-g">
                <header className="App-header pure-u-5-5">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to <span className="flip-horizontal">R</span>everse</h1>
                </header>
                <div className="pure-u-1 pure-u-md-1-5"/>
                <div className="pure-u-1 pure-u-md-3-5">
                    <SentenceForm onFormSubmit={this.onFormSubmit}/>
                    <Sentence value={this.state.reversedSentence}/>
                </div>
                <div className="pure-u-1 pure-u-md-1-5"/>
                <div className="pure-u-1">
                    <hr/>
                </div>
                <div className="pure-u-1 pure-u-md-1-5"/>
                <div className="pure-u-1 pure-u-md-3-5">
                    <SentenceList sentences={this.state.sentenceHistory}/>
                </div>
                <div className="pure-u-1 pure-u-md-1-5"/>
            </div>
        );
    }
}

class SentenceForm extends Component {

    constructor() {
        super();

        this.state = {
            sentence: null
        };

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleReverseClick = this.handleReverseClick.bind(this)
    }

    handleReverseClick(e) {
        e.preventDefault();
        this.props.onFormSubmit(this.state.sentence)
    }

    handleInputChange(e) {
        this.setState({sentence: e.target.value})
    }

    render() {
        return <form id="submitSentence" onSubmit={this.handleReverseClick} className="pure-form pure-u-1">
            <fieldset>

                <div className="pure-u-1">
                    <label htmlFor="sentence">Sentence to reverse:</label>
                    <input id="sentence" onChange={this.handleInputChange} type="sentence" placeholder="Sentence"
                           className="pure-u-1"/>
                </div>
                <button type="submit" className="Submit-button pure-button pure-button-primary">Reverse!</button>
            </fieldset>
        </form>
    }
}

class SentenceList extends Component {
    renderSentence(sentence) {
        return (
            <li>
                <Sentence value={sentence}/>
            </li>
        )
    }

    render() {
        return (
            <div className="pure-u-1">
                <h3>Last reversed sentences</h3>
                <ul className="Sentence-history">
                    {this.props.sentences.map(s => this.renderSentence(s))}
                </ul>
            </div>
        )
    }
}

class Sentence extends Component {
    render() {
        if (this.props.value === null) return null;

        return (<span>
                <b>Original:</b> {this.props.value.original}<br/>
                <b>Reversed:</b> {this.props.value.reversed}
                </span>
        )
    }
}

export default App;
