import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import axios from 'axios';


// Types
type CommentType = {
    postId: string
    id: string
    name: string
    email: string
    body: string
}

// Api
const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})

const commentsAPI = {
    getComments() {
        return instance.get<CommentType[]>('comments')
    },
    createComment() {
        const payload = {
            body: 'Это просто заглушка. Backend сам сгенерирует новый комментарий и вернет его вам',
        }
        return instance.post('comments', payload)
    }
}

// Reducer
const initState = [] as CommentType[]

type InitStateType = typeof initState

const commentsReducer = (state: InitStateType = initState, action: ActionsType) => {
    switch (action.type) {
        case 'COMMENTS/GET-COMMENTS':
            return action.comments
        case 'COMMENTS/CREATE-COMMENT':
            return [action.comment, ...state]
        default:
            return state
    }
}


const getCommentsAC = (comments: CommentType[]) => ({type: 'COMMENTS/GET-COMMENTS', comments} as const)
const createCommentAC = (comment: CommentType) => ({type: 'COMMENTS/CREATE-COMMENT', comment} as const)

type ActionsType = ReturnType<typeof getCommentsAC> | ReturnType<typeof createCommentAC>

const getCommentsTC = (): AppThunk => (dispatch) => {
    commentsAPI.getComments()
        .then((res) => {
            dispatch(getCommentsAC(res.data))
        })
}

const addCommentTC = (): AppThunk => (dispatch) => {
    commentsAPI.createComment()
        .then((res) => {
            dispatch(createCommentAC(res.data))
        })
}

// Store
const rootReducer = combineReducers({
    comments: commentsReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


// App
const App = () => {
    const dispatch = useAppDispatch()
    const comments = useAppSelector(state => state.comments)

    useEffect(() => {
        dispatch(getCommentsTC())
    }, [])

    const addCommentHandler = () => {
        alert('Комментарий добавить не получилось. Напишите код самостоятельно 🚀')
    };

    return (
        <>
            <h1>📝 Список комментариев</h1>
            <button style={{marginBottom: '10px'}}
                    onClick={addCommentHandler}>Добавить новый комментарий
            </button>
            {
                comments.map(p => {
                    return <div key={p.id}><b>описание</b>: {p.body}</div>
                })
            }
        </>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)

// 📜 Описание:
// При нажатии на кнопку "Добавить новый комментарий" комментарий должен добавиться,
// но появляется alert.
// Вместо alerta напишите код, чтобы комментарий добавлялся.
// Правильную версию строки напишите в качестве ответа.
// 🖥 Пример ответа: return instance.get<CommentType[]>('comments?_limit=10')