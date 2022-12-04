import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false)

    const marvelService = new MarvelService();


    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    }, [])

    const onCharactersLoaded = (newCharList) => {
        console.log(newCharList)
        console.log(charList)
        if(JSON.stringify(charList) === JSON.stringify(newCharList)) {
            return;
        }
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setnewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)

    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }
    
    const onCharListLoading = () => {
        setnewItemLoading(true);
    }

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharactersLoaded)
            .catch(onError)
    }

    const itemRefs = [];

    const setRef = (ref) => {
        itemRefs.push(ref)
    }

    const focusOnItem = (id) => {
        itemRefs.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs[id].classList.add('char__item_selected');
        itemRefs[id].focus()
    }

    const renderItems = (arr) => {

        const items = arr.map((item,i) => {

            let styleForImg = {};

            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                styleForImg = {
                    'objectFit': "contain"
                }
            }

            return (
                <li 
                    className='char__item'
                    key={item.id} 
                    ref={setRef}
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if(e.key === '' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            focusOnItem(i)
                        }
                    }}>
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

    const items = renderItems(charList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;
            
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
            className="button button__main button__long" 
            disabled={newItemLoading}
            style={{'display' : charEnded ? "none" : "block"}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}


CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;