import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'

import BlueButton from '../../commonComponents/BlueButton'
import LinksPanel from '../../components/PersonInfoComponents/LinksPanel'
import NavigatingPanel from '../../components/PersonInfoComponents/NavigatingPanel'
import PersonMainInfo from '../../components/PersonInfoComponents/PersonMainInfo'
import { url } from '../../consts'
import { openSupportModal } from '../../store/types/Modal'
import { tryToGetPersonInfo } from '../../store/types/PersonInfo'

import Space from '../../space.png'

import './styles.sass'
import getTronWallet from '../../functions/getTronWallet'
import axios from 'axios'
import { LargeImageIcon, PencilIcon, UploadIcon } from '../../icons/icons'

const PersonInfoContainer = () => {

    const dispatch = useDispatch()

    const data = useSelector( (state: any) => (state.personInfo)).main_info
    const backer = useSelector( (state: any) => (state.user))

    const tron_token = getTronWallet()

    const { pathname } = useLocation()

    useEffect( () => {
        if (backer && backer.id) {
            dispatch(tryToGetPersonInfo({username: pathname.slice(pathname.indexOf('@')), id: backer.id}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backer])

    const isEditMode: boolean = tron_token === data.tron_token

    const [file, setFile] = useState<any>();
    const [fileName, setFileName] = useState("");
    const [imagebase64, setImagebase84] = useState<any>('')
    const [description, setDescription] = useState(data.user_description)
    const [descriptionChanged, setDescriptionChanged] = useState<boolean>(false)

    const [isMouseOnBackground, setIsMouseOnBackground] = useState<boolean>(false)
    const [isMouseOnDescription, setIsMouseOnDescription] = useState<boolean>(false)

    const follow = async () => {
        axios.post('/api/user/follow', {
            backer_id: backer.id,
            backer_username: backer.username,
            creator_id: data.id,
            creator_username: data.username,
        }).then( res => {
                dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
            
        })

    }

    const sendFile = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName)
        axios.post('/api/user/user/edit-background/'+tron_token, formData)
        setFileName('')
        setFile('')
        setImagebase84('')
        dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
    }

    const fileToBase64 = (file: any) => {
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setImagebase84(reader.result);
            reader.onerror = (error) => reject(error);
        })
    }

    const saveFile = (ev: any) => {
        setFile(ev.target.files[0]);
        fileToBase64(ev.target.files[0])
        setFileName(ev.target.files[0].name);
    };

    const submitDescription = () => {
        axios.post(
            '/api/user/user/edit-description/', 
            {
                tron_token: tron_token,
                description: description
            }
        ).then( res => {
            if (res) {
                setDescriptionChanged(false)
                dispatch(tryToGetPersonInfo(pathname.slice(pathname.indexOf('@'))))
            }
        })
        
    }

    return (
        <div
            className='person-info-container'
        >  
            <div
                className='person-info-container__background'
                onMouseEnter={() => setIsMouseOnBackground(true)}
                onMouseLeave={() => setIsMouseOnBackground(false)}
            >
                <img 
                    src={
                        fileName.length>0
                        ?
                        (imagebase64 || '')
                        :
                        (data.backgroundlink && data.backgroundlink.length>0 ? `${url + data.backgroundlink}` : Space)
                    }
                />
                {
                    isEditMode
                    &&
                    <input 
                        type='file'
                        onChange={saveFile}
                    />
                }

                <div
                    className='person-info-container__background__save'
                    style={{
                        opacity: fileName.length>0 ? '1' : '0'
                    }}
                    onClick={() => {
                        if (isEditMode) {
                            sendFile()
                        }
                    }}
                >
                    Save
                </div>
                <div
                    className='person-info-container__background__dark'
                    style={{
                        opacity: isMouseOnBackground && isEditMode ? '0.8' : '0'
                    }}
                >
                    <div>
                        <UploadIcon/>
                        <span>
                            <FormattedMessage id='profile_info_background_title' />
                        </span>
                    </div>
                </div>
            </div>

            <div
                className='person-info-container__information-wrapper'
            >
                <div
                    className='person-info-container__information-wrapper__information'
                >

                    <PersonMainInfo/>

                    <div
                        className='person-info-container__information-wrapper__information__description'
                    >
                        
                        {
                            isEditMode
                            ?
                            <textarea
                                placeholder='There can be description'
                                value={descriptionChanged ? description : data.user_description}
                                onChange={(event) => {
                                    setDescriptionChanged(true)
                                    setDescription(event.target.value)
                                }}
                                onFocus={() => setIsMouseOnDescription(false)}
                                onMouseEnter={() => setIsMouseOnDescription(true)}
                                onMouseLeave={() => setIsMouseOnDescription(false)}
                            >

                            </textarea>
                            :
                            <>
                                {
                                    data.user_description && data.user_description.length>0
                                    ?
                                    data.user_description
                                    :
                                    <>
                                        There can be description
                                    </>
                                }
                            </>
                        }
                        <div
                            className='dark'
                            style={{
                                opacity: isEditMode && isMouseOnDescription ? '1' : '0'
                            }}
                        >
                            <PencilIcon/>
                        </div>
                        {
                            descriptionChanged && isEditMode
                            &&
                            <div
                                className='person-info-container__information-wrapper__information__description__button'
                                onClick={() => submitDescription()}
                            >
                                Save
                            </div>
                        }
                    </div>

                    <NavigatingPanel/>

                    <LinksPanel
                        twitter={data.twitter}
                        facebook={data.facebook}
                        youtube={data.google}
                        discord={data.discord}
                    />

                    <div
                        className='person-info-container__information-wrapper__information__buttons'
                    >
                        {
                            isEditMode || backer.roleplay === 'creators'
                            ?
                            <>
                            </>
                            :
                            <>
                                <div
                                    className='black-button'
                                    onClick={ () => {
                                        if (!data.following) {
                                            follow()
                                        }
                                    }}
                                >
                                    {
                                        (data && data.following)
                                        ?
                                        <FormattedMessage id='profile_info_following'/>
                                        :
                                        <FormattedMessage id='profile_info_follow_button'/>
                                    }
                                    
                                </div>
                                <BlueButton
                                    formatId='profile_info_support_button'
                                    fontSize='18px'
                                    padding='6px 30px'
                                    onClick={() => dispatch(openSupportModal())}
                                />
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonInfoContainer