import React from 'react';


export class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }
    componentDidMount() {
        fetch("https://hn.algolia.com/api/v1/search?query=&page=1")
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    isLoaded: true,
                    items: data.hits
                })
            })
    }
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ... </div>
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.title}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            )
        }
    }
}