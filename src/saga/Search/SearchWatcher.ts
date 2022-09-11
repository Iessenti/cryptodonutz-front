import { call, put, takeEvery } from "redux-saga/effects";
import asyncQuery from "../../functions/asyncQuery";
import { setSearchCreators, TRY_TO_GET_PERSON_BY_NAME } from "../../store/types/Search";

const asyncSearch = async (name: string) => {
    const data = await asyncQuery(
        'GET',
        '/api/user/users/'+name
    )
    if (data) {
        return data
    }
}

function* SearchWorker (action: any): any {
    const data: any = yield call(asyncSearch, action.payload)

    if (data) {
        yield put(setSearchCreators(data))
    }
}

export function* SearchWatcher() {
    yield takeEvery(TRY_TO_GET_PERSON_BY_NAME, SearchWorker)
}