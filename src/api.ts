import got from 'got';

import type { Commit } from './types/commits.js';

const commitCache = new Map<string, string>();
const getCommitDateBefore = async (
    owner: string,
    repo: string,
    branch: string,
    beforeDate: string,
) => {
    const key = `${owner}/${repo}/${branch}/${beforeDate}`;
    if (commitCache.has(key)) {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        return commitCache.get(key) as string;
    }

    const commits: Commit[] = await got.get(`https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&until=${beforeDate}&per_page=1`, {
        headers: {
            Authorization: process.env.GITHUB_TOKEN,
        },
    }).json();
    const { sha } = commits[0];

    commitCache.set(key, sha);
    return sha;
};

export default getCommitDateBefore;
