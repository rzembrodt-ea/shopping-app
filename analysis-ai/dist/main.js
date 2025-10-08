import "dotenv/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getPullRequestFiles } from "./github.js";
import { getGeminiContent } from "./gemini.js";
const argv = yargs(hideBin(process.argv))
    .option('repo', { type: 'string', demandOption: true })
    .option('ref', { type: 'string', demandOption: true })
    .parseSync();
async function main() {
    try {
        const prNumber = Number(argv.ref.split('/')[0]);
        const responses = await getPullRequestFiles(argv.repo, prNumber);
        console.log('Files from pull request: ' + responses ? responses.length : 0);
        let fileRequests = '';
        for (const response of responses) {
            console.log('\t- ' + response.filename);
            fileRequests += `File: ${response.filename}, file patch: ${response.patch}\n`;
        }
        const geminiResponse = await getGeminiContent(`Generate suggested code changes and unit tests for the following pull request\n${fileRequests}`);
        if (geminiResponse) {
            console.log('Gemini response: ' + geminiResponse);
        }
    }
    catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
}
await main();
