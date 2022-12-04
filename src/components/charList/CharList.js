import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false)

    const {error, loading, getAllCharacters, clearError} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])


    const onCharactersLoaded = (newCharList) => {
        
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }

        setCharList([...charList, ...newCharList]);
        setnewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)
    }


    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true)
        clearError()
        getAllCharacters(offset)
            .then(onCharactersLoaded)
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
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
            
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
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