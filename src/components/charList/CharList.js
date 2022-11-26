import {Component} from 'react'
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner';

import './charList.scss';
class CharList extends Component {

    state = {
        characters: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharactersLoaded)
            .catch(this.onError)
    }

    onCharactersLoaded = (characters) => {
        this.setState(({
            characters,
            loading: false 
        }))
    }

    onError = () => {
        this.setState(({
            loading: false,
            error: true
        }))
    }
    
    onLoadMore = () => {

    }

    renderItems(arr) {

        const items = arr.map(item => {

            let styleForImg = {};

            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                styleForImg = {
                    'objectFit': "contain"
                }
            }
    
            return (
                <li className="char__item" key={item.id} onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={styleForImg}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {characters, loading, error} = this.state;
        const items = this.renderItems(characters)

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;