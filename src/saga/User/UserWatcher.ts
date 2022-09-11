import { call, put, takeEvery } from "redux-saga/effects";
import { setUser, TRY_TO_GET_USER } from "../../store/types/User";

const asyncGetUser = async (tron_token: string) => {
    const response = await fetch('/api/user/'+tron_token)
    if (response.status === 200) {
        const result = await response.json()
        return result
    }
}

function* UserWorker(action: any): any {
    const data: any = yield call(asyncGetUser, action.payload)
    if (data) {
        yield put(setUser(data))
    }
}

export function* UserWatcher() {
    yield takeEvery(TRY_TO_GET_USER, UserWorker)
}