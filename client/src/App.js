import React from 'react';

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
                <ul className="list-group">
                    {this.state.currirulums.map((curriculum, index) => {
                        return <li key={index} className="list-group-item">{curriculum.name}</li>
                    })}
                </ul>
            </div>
        )
    }
}