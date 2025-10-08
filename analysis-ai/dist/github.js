import axios from "axios";
const GITHUB_API = 'https://api.github.com';
export async function getPullRequestFiles(repo, pullRequest) {
    const response = await axios.get(`${GITHUB_API}/repos/${repo}/pulls/${pullRequest}/files`);
    if (response.status === 200 && response.data != null) {
        return response.data;
    }
    else {
        console.error('Error retrieving pull request: ' + response.statusText);
        return [];
    }
}
