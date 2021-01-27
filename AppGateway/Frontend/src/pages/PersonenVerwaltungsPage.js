import axios from 'axios';
import { useContext, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const PersonenVeraltungsPage = () => {
    const authState = useContext(useAuth);
    const URLData = 'http://localhost:3005/getData'
    const [myData, setMyData] = useState("");
    const getMyData = (e) => {
        axios.get(URLData, {
            headers: {
                'Authorization': `Bearer ${authState.accessToken}`
            }
        }).then((response) => {
            setMyData(JSON.stringify(response.data, null, 2));
            console.log(response)
        })
            .catch(function (error) {
                console.log(error);
            })
    }
    return (
        <div>
            <h2>Ich bin die Personenverwaltung</h2>
            <button onClick={getMyData}>getMyData</button>
            <p>{myData}</p>
        </div>
    )
}

