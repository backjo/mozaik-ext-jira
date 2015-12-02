import React, { Component, PropTypes } from 'react';
import reactMixin                      from 'react-mixin';
import { ListenerMixin }               from 'reflux';
import _                               from 'lodash';
import Mozaik                          from 'mozaik/browser';
const  { Pie }                         = Mozaik.Component;


class IssueLabelsDonut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total:  0,
            labels: []
        };
    }

    getApiRequest() {
        let { jql } = this.props;

        return {
            id:     `jira.filter.${ jql }`,
            params: {
                jql: jql
            }
        };
    }

    getColor(priority) {
        if(priority.id == "1") {
            return "ff0000"
        } else if (priority.id == "2") {
            return "0000ff"
        } else if (priority.id == "3") {
            return "00ff00"
        } else {
            return "551a8b"
        }
    }

    onApiData(issues) {
        var labels = {};
        issues.issues.forEach(issue => {
            if (!labels[issue.fields.priority.name]) {
                labels[issue.fields.priority.name] = issue.fields.priority;
                labels[issue.fields.priority.name].color = this.getColor(issue.fields.priority);
                labels[issue.fields.priority.name].count = 0;
            }
            labels[issue.fields.priority.name].count++;
        });

        this.setState({
            labels: labels,
            total:  issues.issues.length
        });
    }

    render() {
        let { labels, total }     = this.state;
        let { title, repository } = this.props;

        let flatLabels = _.values(labels);
        let data       = flatLabels.map(label => {
            label.color = `#${ label.color }`;
            label.id    = label.name;
            label.label = label.name;

            return label;
        });

        let titleNode = title === undefined ? (
            <span>
                <span className="widget__header__subject">{repository}</span> issue labels
            </span>
        ) : title;

        return (
            <div>
                <div className="widget__header">
                    {titleNode}
                    <i className="fa fa-github" />
                </div>
                <div className="widget__body">
                    <Pie data={data} count={total} countLabel={total > 1 ? 'issues' : 'issue'} innerRadius={0.7}/>
                </div>
            </div>
        );
    }
}

IssueLabelsDonut.propTypes = {
    repository: PropTypes.string.isRequired,
    title:      PropTypes.string
};

reactMixin(IssueLabelsDonut.prototype, ListenerMixin);
reactMixin(IssueLabelsDonut.prototype, Mozaik.Mixin.ApiConsumer);

export { IssueLabelsDonut as default };