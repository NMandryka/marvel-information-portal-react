import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    state = {
        character: {},
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateChar()
    }

    marvelService = new MarvelService();

    onCharLoading = () => {
        this.setState(({
            loading: true
        }))
    }

    onCharacterLoaded = (character) => {
        this.setState(({
            character, 
            loading: false
        }))
    }   

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharacterLoaded)
            .catch(this.onError)
            
    }

    onError = () => {
        this.setState(({
            loading: false,
            error: true
        }))
    }

    render() {

        const {character, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View character={character}/> : null

        return (
            <div className="randomchar">
                {errorMessage} 
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main"
                        onClick={() => this.updateChar()}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({character}) => {

    const {name, thumbnail, homepage, wiki} = character;
    let {description} = character

    if(description?.length < 1) {
        description = 'This character has no description'
    } 
    if(description?.length > 180) {
        description = description.slice(0, 180) + '...'
    }

    let styleForImg = {}

    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        styleForImg = {
            objectFit: "contain"
        }
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={styleForImg}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RandomChar;