import {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService'

import './singleComicPage.scss';

const SingleComicPage = (props) => {

    const {comicId} = useParams();
    const [comic, setComic] = useState(null)
    const {loading, error, getComic, clearError} = useMarvelService();


    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    useEffect(() => {
        updateComic();
    }, [comicId])

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const updateComic = () => {
        clearError()
        getComic(comicId)
            .then(onComicLoaded)  
    }

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {

    const {price, thumbnail, description, title, pageCount, language} = comic;

    return (
        <div className="single-comic">
            <div className="single-comic">
                <img src={thumbnail} alt={title} className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{title}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">Language: {language}</p>
                    <div className="single-comic__price">{price}</div>
                </div>
                <Link to='/comics' className="single-comic__back">Back to all</Link>
            </div>
        </div>
    )
}

export default SingleComicPage;