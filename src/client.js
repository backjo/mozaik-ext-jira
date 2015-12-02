import request from 'superagent';
import config  from './config';
import Promise from 'bluebird';
import chalk   from 'chalk';
require('superagent-bluebird-promise');




/**
 * @param {Mozaik} mozaik
 */
const client = function (mozaik) {

    mozaik.loadApiConfig(config);

    function buildRequest(path, query) {
        let url = config.get('jira.baseUrl') + path;

        mozaik.logger.info(chalk.yellow(`[jira] fetching from ${ url } with query ${query}`));
        console.log(query);
        return request
            .get(url)
            .query(`jql=${query}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Basic ${config.get('jira.basicAuth')}`)
            .promise()
            ;
    }

    return {
        filter: function(params) {
            return buildRequest(`/search?maxResults=1000`,params.jql)
                .then(res => res.body);
        }
    };
};


export { client as default };
