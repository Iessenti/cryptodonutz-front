
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TronIcon } from '../../../icons/icons'
import './styles.sass'

const titles = [
    'Name',
    'DONATIONS',
    'USD'
]

// const data: {[index: string]:any}[] = [
//     {
//         name: 'crypto.diablos',
//         donate: <span><TronIcon/> 5000.000</span>,
//         pay: '329',
//     },
//     {
//         name: 'crypto.diablos',
//         donate: <span><TronIcon/> 5000.000</span>,
//         pay: '329',
//     },
//     {
//         name: 'crypto.diablos',
//         donate: <span><TronIcon/> 5000.000</span>,
//         pay: '329',
//     },
//     {
//         name: 'crypto.diablos',
//         donate: <span><TronIcon/> 5000.000</span>,
//         pay: '329',
//     },
// ]

const keys = [
    'sum_donations',
    'username'
]

const SupportersMainTable = () => {

    const data = useSelector( (state: any) => (state.personInfoPage)).data.data

    const [tronUsdtKoef, setTronUsdtKoef] = useState<number>(0)

    const getPrice = async () => {
        const res: any = await axios.get('https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT')
        setTronUsdtKoef(res.data.price)
    }

    useEffect( () => {
        getPrice()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className='supporters-main-table'
        >
            <div
                className='supporters-main-table__header'
            >
                {
                    titles.map( (title) => (
                        <div>
                            {
                                title
                            }
                        </div>
                    ))
                }
            </div>
            <div
                className='supporters-main-table__main'
            >
                {
                    data
                    &&
                    data.supporters
                    &&
                    data.supporters.length>0
                    &&
                    data.supporters.map( (row: any, rowIndex: number) => (
                        <div
                            className='supporters-main-table__main__row'
                            key={'supporters-main-table__main__row'+rowIndex}
                        >

                            {
                                Object.keys(row).map( (val, valIndex) => {
                                    if (keys.includes(val)) {
                                        return (
                                            <span 
                                                key={'supporters-main-table__main__row__val'+valIndex}
                                            >
                                                { 
                                                    row[val]
                                                }
                                                <div
                                                
                                                >
                                                {
                                                    val === 'sum_donations'
                                                    &&
                                                    <TronIcon/>
                                                }
                                                </div>
                                            </span>
                                        )
                                    }
                                }       
                                )
                            }
                            <span 
                                style={{
                                    textAlign: 'end', 
                                }}
                            >
                                { 
                                   '$ ' + Math.round( parseFloat(row.sum_donations)*tronUsdtKoef )
                                }
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SupportersMainTable