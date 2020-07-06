import React from 'react';

export default class NewsItem extends React.Component {
    constructor() {
        super();
        this.state = {
        newsData: {},
        upvoteCount: 0,
        domainName: '',
        formattedDate: '',
        };
    }

    componentDidMount() {
        const { newsData } = this.props;
        this.setState({
        newsData,
        upvoteCount: newsData.points,
        });
        const { url, created_at } = newsData;
        this.getDomainName(url);
        this.getDuration(created_at);
    }

    getDomainName(url) {
        if (url) {
        const urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
        this.setState({
            domainName: urlParts[0],
        });
        }
    }

    getDuration(pastDate) {
        let formattedDate = '';
        const datePast = new Date(pastDate);
        const dateNow = new Date();

        let seconds = Math.floor(((dateNow) - datePast) / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365);

        hours -= (days * 24);
        minutes = minutes - (days * 24 * 60) - (hours * 60);
        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
        if (years) {
        formattedDate = `${years} year${years > 1 ? 's' : ''}`;
        } else if (days) {
        formattedDate = `${days} day${days > 1 ? 's' : ''}`;
        } else if (hours) {
        formattedDate = `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes) {
        formattedDate = `${minutes} min${minutes > 1 ? 's' : ''}`;
        }
        this.setState({
        formattedDate,
        });
    }

    upgradeUpvote() {
        const { upvoteCount } = this.state;
        const newUpvote = upvoteCount + 1;
        this.setState({
        upvoteCount: newUpvote,
        }, () => {
        this.props.upvoteItem(this.state);
        });
    }

    render() { 
        const {
        upvoteCount, newsData, formattedDate, domainName,
        } = this.state;
        const { num_comments, title, author } = newsData;
        const { hideItem } = this.props;
        const numComments = num_comments;
        let upvoteColor = upvoteCount > 80 && upvoteCount <= 100 ? '#ab4400' : '';
        if (upvoteCount > 100) {
        upvoteColor = '#ff6502';
        }
        return (
        <tr>
            <td className="comment-number">{numComments}</td>
            <td>
                <div className="upvotes" style={{ color: upvoteColor }}>{upvoteCount}</div>
            </td>
            <td>
                <button className="carot-arrow" type="button" onClick={() => this.upgradeUpvote()} />
            </td>
            <td>
                <div className="title">
                    <span>{title}</span>
                    {' '}
                    {domainName ? (
                    <span className="small-text">
                        (
                        <a href={domainName} className="grey-text">
                        {domainName}
                        </a>
                        )
                    </span>) : null}
                    <span className="small-text"> by </span>
                    <span className="username">
                        {' '}
                        {author}
                        {' '}
                        </span>
                        <span className="grey-text">
                        {' '}
                        {formattedDate}
                        {' '}
                        ago
                        {' '}
                    </span>
                    <span className="grey-text">[ </span>
                    <button className="hide-btn" type="button" onClick={() => hideItem(this.props)}>hide</button>
                    <span className="grey-text"> ]</span>
                </div>
            </td>
        </tr>
        );
    }
}
