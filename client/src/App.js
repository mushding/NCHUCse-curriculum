import React from 'react';
import DashBoard from './Pages/DashBoard/DashBoard'

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currirulums: [],
        }
    }
    async componentWillMount(){
        let res = await fetch('/getAll');
        let currirulums = await res.json();
        this.setState({ currirulums });
    }
    render(){
        return(
            <div>
                <DashBoard/>
                <ul className="list-group">
                    {this.state.currirulums.map((curriculum, index) => {
                        return <li key={index} className="list-group-item">{curriculum.name}</li>
                    })}
                </ul>
            </div>
        )
    }
}