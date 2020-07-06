import React from 'react';
import NewsItem from './components/NewsItem'
import LineChart from './components/LineChart'
import axios from 'axios'
import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            pageNo: 1,
            newsList: [],
            loading: true,
            error: null,
        }
    }

    componentDidMount() {
        this.getNewsListData();
    }

    getNewsListData() {
        debugger;
        const urlParams = new URLSearchParams(window.location.search);
        let pageNo = urlParams.get('page') || 1;
        axios.get(`http://hn.algolia.com/api/v1/search_by_date?page=${pageNo}&numericFilters=num_comments>10,points>10`)
            .then((response) => {
                let result = response.data.hits;
                let hideNewsList = localStorage.getItem('hideNewsList');
                let localUpvoteCount = localStorage.getItem('updatedUpvoteCount');
                if (hideNewsList) {
                    hideNewsList = JSON.parse(hideNewsList);
                    result = result.filter(val => hideNewsList.indexOf(val.objectID) === -1);
                }
                if(localUpvoteCount){
                    let upvoteCount = JSON.parse(localUpvoteCount);
                    result.forEach((val) => {
                      val.points = upvoteCount[val.objectID] || val.points;
                    })
                }
                this.modifyDataForLineChart(result);
                this.setState({
                    newsList: result,
                    loading: false,
                    pageNo: pageNo
                });
                console.log(this.state.pageNo);
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err.message
                })
            })
    }

    modifyDataForLineChart(data) {
        let xAxis = data.map(val => val.objectID);
        let yAxis = data.map(val => val.points);
        return {
            title: {
                text: 'Line Chart'
            },
            yAxis: {
                title: {
                    text: 'Votes',
                    style : {
                        color : '#333333',
                        fontSize : '16px'
                    }
                }
            },
            xAxis: {
                categories: xAxis,
            },
            series: [{
                // name: 'ID',
                data: yAxis
            }]
        }
    }

    gotoPage(pageStatus) {
        debugger;
        const { pageNo } = this.state;
        let page = pageStatus === "next" ? parseInt(pageNo) + 1 : parseInt(pageNo) - 1
        window.history.replaceState(null, null, `?page=${page}`);
        this.setState({
            pageNo: page,
            loading: true,
        }, () => {
            this.getNewsListData();
        });
    }

    hideItem(data) {
        const objectId = data.newsData.objectID;
        let hideNewsList = localStorage.getItem('hideNewsList');
        if (hideNewsList) {
            hideNewsList = JSON.parse(hideNewsList);
        } else {
            hideNewsList = [];
        }
        hideNewsList.push(objectId);
        localStorage.setItem('hideNewsList', JSON.stringify(hideNewsList));
        const { newsList } = this.state;
        let filteredNewsList = newsList.filter(val => val.objectID !== objectId);
        this.setState({
            newsList: filteredNewsList,
        });
    }

    upvoteItem(data){
        const objectId = data.newsData.objectID;
        const newsArr = [...this.state.newsList];
        let localUpvoteCount = localStorage.getItem('updatedUpvoteCount');
        let updatedUpvoteCount = localUpvoteCount ? JSON.parse(localUpvoteCount) : {};
        newsArr.forEach((val) => {
            if(val.objectID === objectId){
                val.points = data.upvoteCount;
                updatedUpvoteCount[objectId] = data.upvoteCount;
            }
        });
        localStorage.setItem('updatedUpvoteCount', JSON.stringify(updatedUpvoteCount));
        this.setState({
            newsList : newsArr
        })
    }

    render() {
        const { newsList, loading, pageNo } = this.state;
        return (
            <div className="page-wrapper container">
                {
                    !loading ?
                    <div>
                        <div className="news-list-wrapper table-responsive">
                            <table className="table" border="0">
                                <thead>
                                    <tr>
                                        <th>Comments</th>
                                        <th>Vote Count</th>
                                        <th>UpVote</th>
                                        <th>News Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList.map(val => (
                                        <NewsItem
                                            key={val.created_at_i}
                                            hideItem={$event => this.hideItem($event)}
                                            upvoteItem={$event => this.upvoteItem($event)}
                                            newsData={val}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-btn-wrapper">
                                {
                                    !loading
                                    ?
                                    <div>
                                        <button onClick={() => this.gotoPage("prev")} disabled={pageNo === 1} type="button" className="pagination-btn">Prev</button>
                                        <button onClick={() => this.gotoPage("next")} type="button" className="pagination-btn">Next</button>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                        <section className="chart-wrapper">
                            <LineChart config={this.modifyDataForLineChart(newsList)} />
                        </section>
                    </div>
                    :
                    <div className="preloader">
                        <img src="spinner.svg" alt="spinner" />
                    </div>
                }
            </div>
        );
    }
}

export default App;
